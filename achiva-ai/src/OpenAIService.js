


// Wraps OpenAI audio and chat APIs for speech-to-text and task extraction.
class OpenAIService{

    // Sends recorded audio to OpenAI for transcription.
    async transcribeAudio(file, OPENAI_API_KEY) {

        try{

            const formData = new FormData();

            formData.append("file", file)

            formData.append("model", "gpt-4o-mini-transcribe");

            const API_URL = "https://api.openai.com/v1/audio/transcriptions";
            const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${OPENAI_API_KEY}`,
            },
            body: formData,
            });

            const data = await response.json();

            return data;
        }
        catch(error){
            console.log("Error Transcribing Audio::"+error)

            return [];
        }


    }


    // Converts a transcript into a list of individual task object.
    async splitTasks(transcript, OPENAI_API_KEY){

        try{

            const data = {
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content:
                            `You are an AI assistant that extracts structured todo tasks from a user's speech.

                                Your job is to identify every task mentioned and return ONLY a valid JSON array.

                                Each task must have this structure:

                                [
                                {
                                    "title": "string",
                                    "description": "string",
                                    "dueDate": "YYYY-MM-DDTHH:mm:ss.sssZ | null"
                                }
                                ]

                                Rules:

                                1. Return ONLY valid JSON. Do not include markdown or explanations.

                                2. The title should be short and actionable.
                                Examples:
                                - "Buy groceries"
                                - "Call mom"
                                - "Visit supermarket"

                                3. Put additional details in the description.
                                If there are no additional details, use an empty string.
    

                                4. Return dueDate as an ISO-8601 datetime string.
                                If no due date can be determined, return null.

                                5. Split multiple tasks into separate objects.

                                6. Do not invent information.
                                Only extract what the user actually says.

                                7. If the user says something that is not a task, ignore it.

                                Today's date is:
                                ${new Date().toISOString()}`

                             
                    },
                    {
                        role: "user",
                        content: transcript
                    }
                ],
                temperature: 0
            }


            const API_URL = "https://api.openai.com/v1/chat/completions";

            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${OPENAI_API_KEY}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();


            const texts = JSON.parse(result.choices[0].message.content);


            return texts;  

        } catch (error) {
            console.log("Error splitting Task::"+error)
            
        }


    }

}

export default new OpenAIService();