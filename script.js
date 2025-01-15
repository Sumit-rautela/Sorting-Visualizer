const canvas = document.getElementById('visualizer');
const ctx = canvas.getContext('2d');
const array = [];
let barWidth=20;
let animationSpeed = 50;
let arraySize = 25;

// Generate a random array
function resetArray() {
  array.length = 0;
  barWidth = canvas.width / arraySize;
  for (let i = 0; i < arraySize; i++) {
    array.push(Math.random() * canvas.height);
  }
  drawArray();
}

// Draw the array as bars
function drawArray(highlight = []) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  array.forEach((height, index) => {
    ctx.fillStyle = highlight.includes(index) ? 'blue' : 'white';
    ctx.fillRect(index * barWidth, canvas.height - height, barWidth, height);
    ctx.strokeStyle = 'black';
    ctx.strokeRect(index * barWidth, canvas.height - height, barWidth, height);
  });
}

// Bubble Sort
async function bubbleSort() {
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array.length - i - 1; j++) {
      drawArray([j, j + 1]);
      await sleep(animationSpeed);

      if (array[j] > array[j + 1]) {
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
      }
    }
  }
  drawArray();
}

// Selection Sort
async function selectionSort() {
  for (let i = 0; i < array.length; i++) {
    let minIndex = i;
    for (let j = i + 1; j < array.length; j++) {
      drawArray([minIndex, j]);
      await sleep(animationSpeed);

      if (array[j] < array[minIndex]) {
        minIndex = j;
      }
    }
    if (minIndex !== i) {
      [array[i], array[minIndex]] = [array[minIndex], array[i]];
    }
  }
  drawArray();
}
  
// Merge Sort
async function mergeSort(start = 0, end = array.length - 1) {
  if (start >= end) return;

  const mid = Math.floor((start + end) / 2);
  await mergeSort(start, mid);
  await mergeSort(mid + 1, end);
  await merge(start, mid, end);
  drawArray();
}

async function merge(start, mid, end) {
  const left = array.slice(start, mid + 1);
  const right = array.slice(mid + 1, end + 1);
  let i = 0, j = 0, k = start;

  while (i < left.length && j < right.length) {
    drawArray([k]);
    await sleep(animationSpeed);

    if (left[i] <= right[j]) {
      array[k++] = left[i++];
    } else {
      array[k++] = right[j++];
    }
  }

  while (i < left.length) {
    drawArray([k]);
    await sleep(animationSpeed);
    array[k++] = left[i++];
  }

  while (j < right.length) {
    drawArray([k]);
    await sleep(animationSpeed);
    array[k++] = right[j++];
  }
}

// Insertion Sort
async function insertionSort() {
    for (let i = 1; i < array.length; i++) {
      let key = array[i];
      let j = i - 1;
      drawArray([i]);
      await sleep(animationSpeed);
  
      while (j >= 0 && array[j] > key) {
        array[j + 1] = array[j];
        j--;
  
        drawArray([j + 1, j + 2]);
        await sleep(animationSpeed);
      }
  
      array[j + 1] = key;
  
      drawArray([j + 1]);
      await sleep(animationSpeed);
    }
  
    drawArray();
  }
  
 // Quick Sort
async function quickSort(start = 0, end = array.length - 1) {
  if (start >= end) return;

  // Partition the array and get the pivot index
  const pivotIndex = await partition(start, end);

  // Recursively apply Quick Sort on the left and right partitions
  await quickSort(start, pivotIndex - 1);
  await quickSort(pivotIndex + 1, end);

  // Final display after sorting each partition
  drawArray();
}

// Partition Function
async function partition(start, end) {
  const pivot = array[start]; // Choosing the first element as pivot
  let pivotIndex = start + 1;

  // Highlight the pivot
  drawArray([start]);
  await sleep(animationSpeed);

  for (let i = start + 1; i <= end; i++) {
    drawArray([i, pivotIndex, start]); // Highlight current element and pivot index
    await sleep(animationSpeed);

    if (array[i] < pivot) {
      // Swap if element is less than the pivot
      [array[i], array[pivotIndex]] = [array[pivotIndex], array[i]];
      pivotIndex++;

      // Update visualization after swap
      drawArray([i, pivotIndex]);
      await sleep(animationSpeed);
    }
  }

  // Place the pivot in its correct position
  [array[start], array[pivotIndex - 1]] = [array[pivotIndex - 1], array[start]];

  // Highlight pivot's final position
  drawArray([pivotIndex - 1]);
  await sleep(animationSpeed);

  return pivotIndex - 1;
}

  
// Sleep Function
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Start Sorting or Searching
function start(type) {
  if (type === 'bubble') bubbleSort();
  if (type === 'insertion') insertionSort();
  if (type === 'selection') selectionSort();
  if (type === 'merge') mergeSort();
  if (type === 'quick') quickSort();
}

// Adjust Speed Dynamically
document.getElementById('speed').addEventListener('input', function () {
  animationSpeed = 100 - this.value;
});

// Adjust Array Size Dynamically
document.getElementById('arraySize').addEventListener('input', function () {
  arraySize = this.value;
  resetArray();
});

// Initialize
resetArray();
