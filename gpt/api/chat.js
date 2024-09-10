export default async function handler(req, res) {
    // POST 메소드 확인
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Only POST requests allowed' });
    }

    try {
        // req.body를 수동으로 파싱
        const body = JSON.parse(req.body);  // req.body가 이미 JSON 형식이라면 이 줄은 생략 가능합니다.
        
        const userMessage = body.message;  // 사용자가 보낸 메시지
        
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

        const data = await response.json();
        const botMessage = data.choices[0].message.content;

        return res.status(200).json({ reply: botMessage });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}
