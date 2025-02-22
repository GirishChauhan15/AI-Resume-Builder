import config from "@/config";

export class AiService{
        async getResult(prompt) {
            try {
                const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${config?.googleApiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: 'google/gemini-2.0-flash-lite-preview-02-05:free',
                    messages: [
                    {
                        role: 'user',
                        content: `${prompt}`,
                    },
                    ],
                }),
        });
        const data = await response.json();
            if(data?.choices?.[0]?.message?.content?.includes('```json') || data?.choices?.[0]?.message?.content?.includes('```')) {
                let updatedData = data?.choices?.[0]?.message?.content?.replace('```json','').replace('```','').replace('```','')
                let formattedData = JSON.parse(updatedData)
                return formattedData
            } else {
                if(data?.choices?.[0]?.message?.content) {
                    let formattedData = JSON.parse(data?.choices?.[0]?.message?.content)
                    return formattedData
                }
            }
            } catch (error) {
              throw error
            }  
          }
}
const aiService = new AiService()

export default aiService;