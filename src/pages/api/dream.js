import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data';

export default async (req, res) => {
    const styleId = req.body.style_id;
    const prompt = req.body.prompt;
    const targetImagePath = req.body.target_img_path;

    const BASE_URL = 'https://api.luan.tools/api/tasks/';

    const headers = {
        headers: {
            Authorization: `Bearer ${process.env.DREAM_API_KEY}`,
            'Content-Type': 'application/json',
        },
    };

    // Step 1) make a POST request to https://api.luan.tools/api/tasks/
    const postPayload = { use_target_image: targetImagePath !== null };

    try {
        const response = await axios.post(BASE_URL, postPayload, headers);
        const taskId = response.data.id;

        // Step 2) skip this step if you're not sending a target image
        if (targetImagePath !== null) {
            const targetImageUrl = response.data.target_image_url.url;
            const fields = response.data.target_image_url.fields;
            const form = new FormData();
            Object.entries(fields).forEach(([field, value]) => {
                form.append(field, value);
            });
            form.append('file', fs.createReadStream(targetImagePath));
            await axios.post(targetImageUrl, form, {
                headers: {
                    ...form.getHeaders(),
                },
            });
        }

        // Step 3) make a PUT request to https://api.luan.tools/api/tasks/{task_id}
        const taskUrl = BASE_URL + taskId;
        const putPayload = {
            input_spec: {
                style: styleId,
                prompt,
                target_image_weight: 0.1,
                width: 800,
                height: 600,
            },
        };
        await axios.put(taskUrl, putPayload, headers);

        // Step 4) Keep polling for images until the generation completes
        let get_Response;
        while (true) {
            get_Response = await axios.get(taskUrl, headers);
            const state = get_Response.data.state;
            if (state === 'generating') {
                console.log('generating');
            } else if (state === 'failed') {
                console.log('failed!');
                break;
            } else if (state === 'completed') {

                const finalUrl = get_Response.data.result;
                const imageResponse = await axios.get(finalUrl, {
                    responseType: 'arraybuffer',
                });

                const imgBlob = Buffer.from(imageResponse.data, 'binary').toString('base64');  // Blob 생성

                res.status(200).json({
                    message: 'Image generation done!',
                    imageUrl: get_Response.data.result,
                    imgBlob // Blob을 base64 문자열로 저장
                });

                console.log('Generated image downloaded to img.jpg! enjoy :)');
                break;
            }
            await new Promise((resolve) => setTimeout(resolve, 4000));
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred during image generation.' });
    }
};
