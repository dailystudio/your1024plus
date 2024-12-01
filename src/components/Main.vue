<template>
  <div class="container">
    <h1>你的1024</h1>
    <div class="numbers">
      <span v-for="num in numbers" :key="num" :class="{ highlighted: isHighlighted(num) }">{{ num }}</span>
    </div>    
    <div class="input-area"> 
      <input type="text" v-model="expression" @input="validateInput" placeholder="请输入表达式">
      <span class="expression-result">{{ expressionResult }}</span>
    </div>    
    <div class="button-group">
      <button @click="checkAnswer">提交</button>
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

// 检查答案
function checkAnswer() {
  console.log("numbers:", numbers.value);
  if (expression.value === '') {
    return; // Don't evaluate if the expression is empty
  }

  try {
    const result = eval(expression.value);
    isCorrect.value = result === 1024;
    endTime = new Date();

    if (isCorrect.value) {
      if (numbers.value.length === 4) { 
        if (userId) {
          const timeTaken = (endTime - startTime) / 1000;
          storeSuccessfulAnswer(userId, numbers.value, expression.value, timeTaken);
        }
      } else {
        console.error("Error: numbers.value does not have exactly 4 elements.");
      }
    }
    showResult.value = true;
  } catch (error) {
    alert('表达式错误，请检查输入!');
  }
}

// 换一题
function changeQuestion() {
  generateNumbers();
  expression.value = '';
  showResult.value = false;
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
