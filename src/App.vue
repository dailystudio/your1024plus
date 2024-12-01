<template>
  <div class="container">
    <h1>你的1024</h1>
    <div class="numbers">
      <span v-for="num in numbers" :key="num" :class="{ highlighted: isHighlighted(num) }">{{ num }}</span>
    </div>    
    <input type="text" v-model="expression" @input="validateInput" placeholder="请输入表达式">
    <div class="button-group">
      <button @click="checkAnswer">提交</button>
      <button @click="changeQuestion">换一题</button>
    </div>
    <div v-if="showResult" class="result">
      <span v-if="isCorrect">恭喜你，答对了！</span>
      <span v-else>很遗憾，答错了。请再试一次。</span>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const numbers = ref([]);
const expression = ref('');
const showResult = ref(false);

const isCorrect = ref(false);

// 生成随机数字 (2的指数倍)
function generateNumbers() {
  numbers.value = [];
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
  if (inputNums) {
    return inputNums.includes(num.toString());
  }
  return false;
}

// 输入验证
function validateInput() {
  expression.value = expression.value.replace(/[^0-9+\-*/]/g, '');
}

// 检查答案
function checkAnswer() {
  if (expression.value === '') {
    return; // Don't evaluate if the expression is empty
  }

  try {
    const result = eval(expression.value);
    isCorrect.value = result === 1024;
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

generateNumbers(); // 初始化生成随机数字
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

.numbers {
  margin-bottom: 20px;
  font-size: 24px;
}

.numbers span {
  color: #FF9900; /* Set text color to orange */
  margin: 0 10px;
}

.highlighted {
  background-color: #FFCC80; /* Use a lighter orange for better contrast */
}

/* Updated input style */
input {
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #222; /* Dark background for input */
  color: #FF9900; /* Orange text for input */
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
</style>
