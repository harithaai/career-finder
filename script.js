document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("start-btn");
  const questionContainer = document.getElementById("question-container");
  const questionEl = document.getElementById("question");
  const optionsEl = document.getElementById("options");
  const nextBtn = document.getElementById("next-btn");
  const submitBtn = document.getElementById("submit-btn");
  const resultContainer = document.getElementById("result-container");
  const resultText = document.getElementById("result");
  const voiceBtn = document.getElementById("voice-btn");

  let currentQuestion = 0;
  let answers = [];

  const questions = [
    { question: "What is your interest?", options: ["MPC", "BIPC", "CEC", "HEC", "Others"] },
    { question: "What is your goal?", options: ["IAS", "IPS", "Doctor", "Teacher", "Business", "Others"] },
    { question: "At present, what are you doing?", options: ["Studying", "Working", "Searching for opportunities", "Others"] },
    { question: "What are your hobbies?", options: ["Games", "Reading", "Drawing", "Music", "Others"] },
    { question: "What is your passion?", options: ["Business", "Gaming", "Fashion", "Teaching", "Others"] }
  ];

  // Start Quiz
  startBtn.addEventListener("click", () => {
    startBtn.classList.add("hide");
    questionContainer.classList.remove("hide");
    showQuestion();
  });

  nextBtn.addEventListener("click", () => {
    currentQuestion++;
    if (currentQuestion < questions.length) {
      showQuestion();
    } else {
      nextBtn.classList.add("hide");
      submitBtn.classList.remove("hide");
    }
  });

  submitBtn.addEventListener("click", showResult);

  function showQuestion() {
    const q = questions[currentQuestion];
    questionEl.textContent = q.question;
    optionsEl.innerHTML = "";

    q.options.forEach(option => {
      const button = document.createElement("button");
      button.textContent = option;
      button.addEventListener("click", () => selectAnswer(option));
      optionsEl.appendChild(button);
    });

    nextBtn.classList.add("hide");
    submitBtn.classList.add("hide");
  }

  function selectAnswer(answer) {
    answers[currentQuestion] = answer;

    if (answer === "Others") {
      const input = document.createElement("input");
      input.type = "text";
      input.placeholder = "Type your answer...";
      input.addEventListener("change", (e) => {
        answers[currentQuestion] = e.target.value;
      });
      optionsEl.appendChild(input);
    }

    if (currentQuestion < questions.length - 1) {
      nextBtn.classList.remove("hide");
    } else {
      submitBtn.classList.remove("hide");
    }
  }

  function showResult() {
    questionContainer.classList.add("hide");
    resultContainer.classList.remove("hide");

    const goal = (answers[1] || "").toLowerCase();
    let result = "<h3>Your Career Guidance:</h3>";

    if (goal.includes("ias") || goal.includes("ips")) {
      result += `Focus on Polity, History, Geography, and Current Affairs.<br>
      <strong>Books:</strong>
      <ul>
        <li><a href="https://www.amazon.in/Indian-Polity-M-Laxmikanth/dp/935260363X">Indian Polity</a></li>
      </ul>`;
    } else if (goal.includes("doctor")) {
      result += `Focus on Biology, Chemistry, and Physics for NEET.<br>
      <strong>Books:</strong>
      <ul>
        <li><a href="https://www.amazon.in/Arihant-Objective-Practice-Exercise-Infographics/dp/9368403597/ref=sr_1_2_sspa?crid=25KBYB2SUH0G5&dib=eyJ2IjoiMSJ9.bui2fmLESqLz22ZxFTE2ZRHzGV1LH7kbIUMyEb67C3HRg8a3eEz4AnzRZPKiRHLHLy-dZ4NUWxaTEi47a9FIQuH2M-lnuo4Z0AbN_FgPwVFAiXFVEswnW8iWyhEgnWYBXg1LC5dNZ7DXieOSvx2zLQx1dIN5uX03jQtLyvqLFN8OS8LDy5DYt4btULacszyUHxPxBLpjcLCr8eSh72gpK0eYBfyb95s8WoMOzaQakbA.CkbYbWM2pYjWbfoUjrK-kyc4yk18mVLwyqkCBxL0yNo&dib_tag=se&keywords=neet+all+in+one+guide+in+english&qid=1767514829&s=books&sprefix=neet+all+in+one+guide+in+english%2Cstripbooks%2C584&sr=1-2-spons&aref=UbpWDHLTdX&sp_csd=d2lkZ2V0TmFtZT1zcF9hdGY&psc=1">NCERT Biology</a></li>
      </ul>`;
    } else if (goal.includes("teacher")) {
      result += `Study Pedagogy, Child Development, and Teaching Methods.<br>
      <strong>Books:</strong>
      <ul>
        <li><a href="https://www.amazon.in/dp/B0G2JBCJXC?ref=cm_sw_r_ffobk_cso_cp_apan_dp_Z0YKW66AJZCMY3JDGG84&ref_=cm_sw_r_ffobk_cso_cp_apan_dp_Z0YKW66AJZCMY3JDGG84&social_share=cm_sw_r_ffobk_cso_cp_apan_dp_Z0YKW66AJZCMY3JDGG84&bestFormat=true">CTET PAPPER 1</a></li>
      </ul>`;
    } else if (goal.includes("business")) {
      result += `Learn Business Studies, Marketing, and Entrepreneurship.<br>
      <strong>Books:</strong>
      <ul>
        <li><a href="https://www.amazon.in/Rich-Dad-Poor-Middle-Updated/dp/1612681131">Rich Dad Poor Dad</a></li>
      </ul>`;
    } else {
      result += "Explore your interests and passions! More guidance coming soon.";
    }

    resultText.innerHTML = result;
    speakText(resultText.innerText);
  }

  // 🎤 AI Voice Assistant (Speech Input + Output)
  const synth = window.speechSynthesis;
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

  recognition.lang = "en-US";
  recognition.continuous = false;
  recognition.interimResults = false;

  voiceBtn.addEventListener("click", () => {
    recognition.start();
  });

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript.toLowerCase();
    speakText("You said: " + transcript);

    if (transcript.includes("start quiz")) {
      startBtn.click();
    } else if (transcript.includes("next")) {
      nextBtn.click();
    } else if (transcript.includes("submit")) {
      submitBtn.click();
    } else {
      speakText("Sorry, I didn’t understand. Say start quiz, next, or submit.");
    }
  };

  function speakText(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    synth.speak(utterance);
  }
}); 