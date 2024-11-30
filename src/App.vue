<template>
  <div class="container">
    <h1>1024点游戏</h1>
    <div class="numbers">
      <span v-for="num in numbers" :key="num" :class="{ highlighted: isHighlighted(num) }">{{ num }}</span>
    </div>
    <input type="text" v-model="expression" placeholder="请输入表达式">
    <button @click="checkAnswer">提交</button>
    <button @click="changeQuestion">换一题</button>
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

// 检查答案
function checkAnswer() {
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
  display: flex;
  flex-direction: column;
  align-items
: center;
  justify-content: center;
  height: 100vh;
}

.numbers {
  margin-bottom: 20px;
  font-size: 24px;
}

.numbers span {
  margin: 0 10px;
}

.highlighted {
  background-color: yellow;
}

input {
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:nth-child(2) { /* 选择第二个按钮 (换一题) */
  padding: 10px 20px;
  background-color: #008CBA; /* 蓝色 */
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 10px; /* 添加一些间距 */
}

.result {
  margin-top: 20px;
  font-size: 18px;
}
</style>
