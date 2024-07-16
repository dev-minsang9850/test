// 1. 요소 선택 및 변수 초기화
const chatbox = document.getElementById('chatbox'); // 채팅 메시지 표시 영역
const userInput = document.getElementById('user-input'); // 사용자 입력 필드
const sendButton = document.getElementById('send-button'); // 전송 버튼

// OpenAI API 키 (개인 키로 변경)
const apiKey = 'sk-proj-a3RtrsiJXFFmToUfzDizT3BlbkFJxFt1qkDSQOuLtK098DzY'; 
let conversationHistory = []; // 대화 기록을 저장할 배열


// 2. ChatGPT API 연동 함수
async function getChatGPTResponse(message) {
    const apiUrl = 'https://api.openai.com/v1/chat/completions';

    // API 요청 데이터 생성
    const requestData = {
        model: 'gpt-3.5-turbo', 
        messages: [...conversationHistory, { role: 'user', content: message }]
    };

    // API 요청 보내기
    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(requestData)
    });

    // API 응답 처리
    if (!response.ok) {
        throw new Error(`API 요청 실패: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    const assistantMessage = data.choices[0].message;
    conversationHistory.push(assistantMessage); // 대화 기록에 추가
    return assistantMessage.content; // 답변 내용 반환
}

// 3. 메시지 전송 이벤트 처리
sendButton.addEventListener('click', async () => {
    const userMessage = userInput.value.trim(); // 입력값 가져오기 및 공백 제거
    if (userMessage !== '') {
        appendMessage('user', userMessage); // 사용자 메시지 추가
        userInput.value = ''; // 입력 필드 초기화

        try {
            const response = await getChatGPTResponse(userMessage);
            appendMessage('assistant', response); // 챗봇 답변 추가
        } catch (error) {
            console.error(error);
            appendMessage('assistant', '죄송합니다. 현재 챗봇이 응답할 수 없습니다.'); // 오류 메시지
        }
    }
});

// 4. 메시지 추가 함수
function appendMessage(sender, message) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);

    // 줄바꿈 처리 및 특수 문자 이스케이프
    const escapedMessage = message.replace(/&/g, '&amp;')
                                  .replace(/</g, '&lt;')
                                  .replace(/>/g, '&gt;')
                                  .replace(/\n/g, '<br>'); 

    messageElement.innerHTML = `
        <div class="content">${escapedMessage}</div>
    `;
    chatbox.appendChild(messageElement);
    chatbox.scrollTop = chatbox.scrollHeight; // 스크롤 자동 내리기
}

// 5. 초기 메시지 (선택 사항)
appendMessage('assistant', "안녕하세요! ChatGPT 학습 도우미입니다. 무엇을 도와드릴까요?");
