<template>
  <div class="container">
    <h1>你的1024</h1>
    <div v-if="showDialog" class="dialog-overlay">
      <div class="dialog-box">
        <h3>提交你的记录</h3>
        <p class="answer-time">{{ answerTime }}s</p> 
        <input type="text" v-model="userName" placeholder="Anonymous">
        <div class="dialog-buttons">
          <button @click="confirmSubmission">确定</button>
          <button @click="cancelSubmission">取消</button>
        </div>
      </div>
    </div>

    <div class="numbers">
      <span v-for="num in numbers" :key="num" :class="{ highlighted: isHighlighted(num) }">{{ num }}</span>
    </div>    
    <div class="input-area"> 
      <input type="text" v-model="expression" @input="validateInput" placeholder="请输入表达式">
      <span class="expression-result">{{ expressionResult }}</span>
    </div>    
    <div class="button-group">
      <button @click="checkAnswer" :disabled="expressionResult !== 1024">提交</button>
      <button @click="changeQuestion">换一题</button>
    </div>    
    <div v-if="showResult" class="result">
      <span v-if="isCorrect">恭喜你，答对了！</span>
      <span v-else>很遗憾，答错了。请再试一次。</span>
    </div>
  </div>
  <div class="top10-image" @click="goToTop10">
    <img src="../assets/top10.svg" alt="Top 10">
  </div>
</template>

<script setup>
import { ref, onMounted,  } from 'vue';
import {useRouter} from 'vue-router'
import { 
  initializeFirebase, 
  signInAnonymouslyFirebase, 
  storeSuccessfulAnswer 
} from '../firebaseUtils';

const numbers = ref([]);
const expression = ref('');
const expressionResult = ref('');
const showResult = ref(false);
const isCorrect = ref(false);

const showDialog = ref(false);
const userName = ref('Anonymous');
const submissionTime = ref('');
const answerTime = ref(0); // To store and display answer time
let startTime, endTime, router;
let userId;

// 生成随机数字 (2的指数倍)
function generateNumbers() {
  numbers.value = [];
  // Reset timer when generating new numbers
  startTime = new Date();
  const exponents = [2, 3, 4, 5, 6, 7, 8, 9]; 
  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * exponents.length);
    const exponent = exponents[randomIndex];
    numbers.value.push(2 ** exponent); 
    exponents.splice(randomIndex, 1); 
  }
}

// 检查数字是否需要高亮
function isHighlighted(num) {
  const inputNums = expression.value.match(/\d+/g); 

  let ret = false;
  if (inputNums) {
    ret = inputNums.includes(num.toString());
  }

  console.log(`${num} is highlighted: ${ret}`)
  return ret;
}

// 输入验证
function validateInput() {
  expression.value = expression.value.replace(/[^0-9+\-*/() ]/g, ''); 
  try {
    if (expression.value) {
      expressionResult.value = eval(expression.value);
    } else {
      expressionResult.value = '';
    }
  } catch (error) {
    expressionResult.value = ''; 
  }
}

// Handle submission confirmation
async function confirmSubmission() {
  showDialog.value = false; 
  
  try {
    if (expression.value && eval(expression.value) === 1024) {
      isCorrect.value = true;
      if (numbers.value.length === 4 && userId) {
        await storeSuccessfulAnswer(userId, numbers.value, expression.value, answerTime.value, userName.value);
        // Automatically generate a new question and refresh the page after successful submission
        changeQuestion(); // Generate a new question without refreshing the page
      }
    } else {
      isCorrect.value = false;
      alert('表达式错误，请检查输入!');
    }
    showResult.value = true;
  } catch (error) {
    console.error("Error during submission:", error); 
  }
}

function cancelSubmission() {
  showDialog.value = false;
}

// 换一题
function changeQuestion() {
  generateNumbers();
  startTime = new Date(); // Reset the timer for the new question
  expression.value = '';
  showResult.value = false;
}

// 检查答案 (now just shows the dialog)
function checkAnswer() {
  showSubmissionDialog(); 
}

function showSubmissionDialog() {
  showDialog.value = true;
  endTime = new Date();
  answerTime.value = Math.round((endTime - startTime) / 1000); // Calculate and set answer time
  const now = new Date();
  submissionTime.value = now.toLocaleString(); 
  userName.value = 'Anonymous'; 
}

// Initialize the game when the component is mounted
onMounted(async () => {
  router = useRouter();
  try {
    await initializeFirebase(); // Get auth object from the promise

    // Sign in anonymously using the retrieved auth object
    const user = await signInAnonymouslyFirebase();
    userId = user.uid; // Set the user ID

  } catch (error) {
    console.error("Error initializing Firebase:", error);
  }

  generateNumbers();
});

const goToTop10 = () => {
  router.push('/top10');
};
</script>

<style scoped>
/* ... (rest of your existing CSS) ... */

/* Styles for the dialog box */
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
  display: flex;
  justify-content: center;
  align-items: center;
}

.dialog-box {
  background-color: black; /* Black background */
  padding: 20px;
  border-radius: 5px;
  color: #FF9900; /* Orange text color */
}

.dialog-buttons {
  color: #FF9900; /* Orange text color */

  margin-top: 10px;
  display: flex;
  justify-content: flex-end; /* Align buttons to the right */
}

.dialog-buttons button {
  margin-left: 10px; /* Add spacing between buttons */
  background-color: transparent; /* Transparent background */
  border: 1px solid #FF9900; /* Orange border */
  color: #FF9900; /* Orange text color */
}
.dialog-box input {
  border-color: white; /* White border for the input */
}

/* Style for the answer time display */
.answer-time {
  font-size: 42px; /* Large font size for answer time */
  margin-bottom: 10px; /* Add spacing below */
  color: #FF9900; /* Orange text color */
}


/* Style for the top10 image at the bottom */
.top10-image {
  position: fixed;
  bottom: 10px; /* Adjust as needed */
  left: 50%;
  transform: translateX(-50%); /* Center horizontally */
  width: 48px;
  height: 48px;
  cursor: pointer; /* Add cursor pointer to indicate clickability*/
}

.top10-image img {
  width: 100%; /* Make the image fill its container */
}

.container {
  width: 100vw; /* Make the container fill the viewport width */
 height: 100vh; /* Make the container fill the viewport height */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: black; 
  color: white; /* Set default text color to white */
  position: fixed; /* Ensure it covers the entire screen */
  top: 0;
  left: 0;
}
.container { padding-bottom: 60px; } /* Add padding to prevent overlap */

.numbers {
  margin-bottom: 20px;
  font-size: 36px; /* Increased font size */
}

/* Style for individual number boxes */
.numbers span {
  display: inline-block;
  padding: 10px 15px; /* Adjust padding for box size */
  margin: 5px;
  border: 3px solid white; 
  border-radius: 5px;
  color: white; 
  background-color: transparent; 
  transition: background-color 0.3s ease, color 0.3s ease; 
}

.highlighted {
  background-color: #FF9900 !important;
  color: white;
  border-color: #FF9900 !important; /* Orange border when highlighted */
}

/* Updated input style */
input {
  padding: 10px;
  margin-bottom: 10px;
  font-size: 18px; /* Increased font size */
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #222; /* Dark background for input */
  color: #FF9900; /* Orange text for input */
}

.input-area {
  display: flex;
  flex-direction: column; /* Arrange input and result vertically */
  align-items: center; /* Center items horizontally */
  width: 100%;
  margin-bottom: 20px; /* Add margin below the input area */
}

.expression-result {
  margin-top: 5px; 
  color: #FF9900; /* Orange text for result */
  font-style: italic;
  text-align: center; /* Center the result text */
  height: 1.5em; /* Fixed height for the expression result */
}  

/* Style for both buttons */
.button-group {
  display: flex; /* Use flexbox for layout */
}

.button-group button {
  padding: 10px 20px;
  background-color: #FF9900;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px; /* Add spacing between buttons */
}

.result {
  margin-top: 20px;
  font-size: 18px;
}

/* Style for the top10 image at the bottom */
.top10-image {
  position: fixed;
  bottom: 10px; /* Adjust as needed */
  left: 50%;
  transform: translateX(-50%); /* Center horizontally */
  width: 48px;
  height: 48px;
  cursor: pointer; /* Add cursor pointer to indicate clickability*/
}

.top10-image img {
  width: 100%; /* Make the image fill its container */
}
</style>
