import { File } from "expo-file-system"


class VoiceAiService{

    // Sends recorded audio to OpenAI for transcription.
    async transcribeAudio(audioUri){

        try{

            const file = new File(audioUri);

            const formData = new FormData();

            formData.append("file", file);


            const response = await fetch("https://achiva-ai.achiva-ai.workers.dev", {
            method: "POST",
            
            body: formData,
        });


            const transcribe = await response.json();

            return transcribe.text;
        }
        catch(error){

            return [];
        }
    }


    // Converts a transcript into a list of individual task object.
    async splitTasks(transcript){

        try{

            const response = await fetch("https://achiva-ai.achiva-ai.workers.dev", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({type:"text", transcript}),
        });


            const data = await response.json();

            return data;
        }
        catch(error){

            return [];
        }
    }

}

export default new VoiceAiService();