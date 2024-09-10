export default async function handler(req, res) {
    const userMessage = req.body.message;
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
            model: 'gpt-4',
            assistant_id: 'asst_Mm019YNqP6syW41JyxdrXLDc',  // 커스텀 Assistant ID
            messages: [{ role: 'user', content: userMessage }],
        }),
    });

    const data = await response.json();
    res.status(200).json({ reply: data.choices[0].message.content });
}
