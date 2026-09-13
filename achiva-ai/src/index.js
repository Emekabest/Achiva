/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import OpenAIService from "./OpenAIService";

export default {
	async fetch(request, env, ctx) {

	
	const contentType = await request.headers.get("content-type");
	

        if (contentType?.includes("multipart/form-data")){
			const formData = await request.formData();
			const file = formData.get("file");

			const data = await OpenAIService.transcribeAudio(file, env.OPENAI_API_KEY);

			return new Response(JSON.stringify(data),{
					headers: {
						"Content-Type": "application/json"
					}
			});
		}
		


	
		if (contentType?.includes("application/json")){

				const body = await request.json();

				const data = await OpenAIService.splitTasks(body.transcript, env.OPENAI_API_KEY);


				return new Response(JSON.stringify(data), {
					headers: {
						"Content-Type": "application/json"
					}
			});
		}

	},
};
