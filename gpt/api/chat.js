export default async function handler(req, res) {
    // POST 메소드 확인
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Only POST requests allowed' });
    }

    try {
        // req.body가 이미 파싱된 JSON 객체로 가정
        const userMessage = req.body.message;  // 사용자가 보낸 메시지
        
        if (!userMessage) {
            return res.status(400).json({ message: 'Message is required' });
        }

        // OpenAI API 호출
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: 'gpt-4',
                messages: [{ role: 'user', content: userMessage }],
            }),
        });

        // OpenAI 응답이 200대가 아닐 경우 에러 처리
        if (!response.ok) {
            const errorData = await response.text();  // 텍스트로 에러를 받아서 처리
            return res.status(response.status).json({ message: 'OpenAI API Error', error: errorData });
        }

        const data = await response.json();

        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
            return res.status(500).json({ message: 'Invalid API response' });
        }

        const botMessage = data.choices[0].message.content;
        return res.status(200).json({ reply: botMessage });

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ message: 'Internal Server Error', error: error.toString() });
    }
}
