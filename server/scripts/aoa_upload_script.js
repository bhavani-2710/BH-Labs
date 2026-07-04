require("dotenv").config({ path: __dirname + "/../.env" });
const mongoose = require("mongoose");
const {
  Types: { ObjectId },
} = mongoose;
const Subject = require("../models/Subject");
const Experiment = require("../models/Experiment");

// ─── Subject ──────────────────────────────────────────────────────────────────
const subjects = [
  {
    _id: new ObjectId("685b2a1f3c4e8d0012a7b002"),
    name: "Analysis of Algorithms",
    code: "2113115",
    semester: 3,
    description:
      "This subject covers the design and analysis of fundamental algorithms including sorting, searching, greedy methods, dynamic programming, graph algorithms, backtracking, branch-and-bound, and string matching techniques.",
  },
];

// ─── Experiments ──────────────────────────────────────────────────────────────
const experiments = [

  // ── Exp 1: Selection Sort & Insertion Sort ─────────────────────────────────
  {
    _id: new ObjectId("685b2a1f3c4e8d0012a7b501"),
    subjectId: new ObjectId("685b2a1f3c4e8d0012a7b002"),
    experimentNumber: 1,
    problemStatement:
      "Experiment based on common mathematical functions. (Selection sort, Insertion sort)",
    subExperiments: [
      {
        part: "a",
        title: "Selection Sort",
        concepts: [
          "Sorting Algorithms",
          "In-place Sorting",
          "Time Complexity O(n^2)",
        ],
        hints: [
          "Find the minimum element in the unsorted portion of the array in each iteration.",
          "Swap the found minimum element with the first element of the unsorted portion.",
          "Maintain two subarrays: one sorted and one unsorted.",
        ],
        difficulty: "Easy",
        problemStatement: "Implement and analyze the Selection Sort algorithm.",
        theory:
          "Selection Sort divides the array into sorted and unsorted regions. Each pass finds the minimum element in the unsorted region and swaps it into the correct position. Time complexity: O(n²) in all cases; Space: O(1). It performs at most n-1 swaps, making it useful when memory writes are costly.",
        algorithm:
          "1. Start\n2. Read array arr[] of n elements\n3. For i = 0 to n-2:\n   a. min_idx = i\n   b. For j = i+1 to n-1: if arr[j] < arr[min_idx], set min_idx = j\n   c. Swap arr[i] and arr[min_idx]\n4. Print sorted array\n5. Stop",
        flowchart: {
          nodes: [
            { id: "1", type: "start",    label: "Start" },
            { id: "2", type: "input",    label: "Read arr[], n" },
            { id: "3", type: "process",  label: "i = 0" },
            { id: "4", type: "decision", label: "i < n-1?" },
            { id: "5", type: "process",  label: "Find min in arr[i..n-1]; swap with arr[i]; i++" },
            { id: "6", type: "output",   label: "Print sorted array" },
            { id: "7", type: "end",      label: "Stop" },
          ],
          edges: [
            { source: "1", target: "2" },
            { source: "2", target: "3" },
            { source: "3", target: "4" },
            { source: "4", target: "5", label: "Yes" },
            { source: "4", target: "6", label: "No" },
            { source: "5", target: "4" },
            { source: "6", target: "7" },
          ],
        },
        referenceSolution: {
          c: '#include <stdio.h>\n\nvoid selectionSort(int arr[], int n) {\n    int i, j, minIndex, temp;\n    for (i = 0; i < n - 1; i++) {\n        minIndex = i;\n        for (j = i + 1; j < n; j++) {\n            if (arr[j] < arr[minIndex])\n                minIndex = j;\n        }\n        temp = arr[i];\n        arr[i] = arr[minIndex];\n        arr[minIndex] = temp;\n    }\n}\n\nvoid printArray(int arr[], int n) {\n    for (int i = 0; i < n; i++)\n        printf("%d ", arr[i]);\n    printf("\\n");\n}\n\nint main() {\n    int n;\n    printf("Enter the number of elements: ");\n    scanf("%d", &n);\n    int arr[n];\n    printf("Enter %d elements:\\n", n);\n    for (int i = 0; i < n; i++)\n        scanf("%d", &arr[i]);\n    printf("Original array: ");\n    printArray(arr, n);\n    selectionSort(arr, n);\n    printf("Sorted array: ");\n    printArray(arr, n);\n    return 0;\n}',
          python: 'def selection_sort(arr):\n    n = len(arr)\n    for i in range(n - 1):\n        min_idx = i\n        for j in range(i + 1, n):\n            if arr[j] < arr[min_idx]:\n                min_idx = j\n        arr[i], arr[min_idx] = arr[min_idx], arr[i]\n    return arr\n\nn = int(input("Enter the number of elements: "))\narr = list(map(int, input(f"Enter {n} elements:\\n").split()))\nprint("Original array:", *arr)\nselection_sort(arr)\nprint("Sorted array:", *arr)',
        },
        samples: [
          { input: "5\n64 25 12 22 11", output: "11 12 22 25 64 \n" },
        ],
      },

      {
        part: "b",
        title: "Insertion Sort",
        concepts: ["Sorting Algorithms", "Stable Sorting", "In-place Sorting"],
        hints: [
          "Maintain a sorted subarray and insert elements one-by-one into their correct positions.",
          "Shift elements larger than the key to the right to make space for the key.",
          "Start from the second element (index 1) and compare it with elements before it.",
        ],
        difficulty: "Easy",
        problemStatement: "Implement and analyze the Insertion Sort algorithm.",
        theory:
          "Insertion Sort builds a sorted subarray one element at a time by picking each element and inserting it into its correct position. Time: O(n²) worst/average, O(n) best (already sorted); Space: O(1). Stable and in-place; efficient for small or nearly-sorted datasets.",
        algorithm:
          "1. Start\n2. Read array arr[] of n elements\n3. For i = 1 to n-1:\n   a. key = arr[i], j = i-1\n   b. While j >= 0 and arr[j] > key: arr[j+1] = arr[j], j--\n   c. arr[j+1] = key\n4. Print sorted array\n5. Stop",
        flowchart: {
          nodes: [
            { id: "1", type: "start",    label: "Start" },
            { id: "2", type: "input",    label: "Read arr[], n" },
            { id: "3", type: "process",  label: "i = 1" },
            { id: "4", type: "decision", label: "i < n?" },
            { id: "5", type: "process",  label: "key=arr[i]; shift larger elements right; arr[j+1]=key; i++" },
            { id: "6", type: "output",   label: "Print sorted array" },
            { id: "7", type: "end",      label: "Stop" },
          ],
          edges: [
            { source: "1", target: "2" },
            { source: "2", target: "3" },
            { source: "3", target: "4" },
            { source: "4", target: "5", label: "Yes" },
            { source: "4", target: "6", label: "No" },
            { source: "5", target: "4" },
            { source: "6", target: "7" },
          ],
        },
        referenceSolution: {
          c: '#include <stdio.h>\n\nvoid insertionSort(int arr[], int n) {\n    int i, key, j;\n    for (i = 1; i < n; i++) {\n        key = arr[i];\n        j = i - 1;\n        while (j >= 0 && arr[j] > key) {\n            arr[j + 1] = arr[j];\n            j--;\n        }\n        arr[j + 1] = key;\n    }\n}\n\nvoid printArray(int arr[], int n) {\n    for (int i = 0; i < n; i++)\n        printf("%d ", arr[i]);\n    printf("\\n");\n}\n\nint main() {\n    int n;\n    printf("Enter the number of elements: ");\n    scanf("%d", &n);\n    int arr[n];\n    printf("Enter %d elements:\\n", n);\n    for (int i = 0; i < n; i++)\n        scanf("%d", &arr[i]);\n    printf("Original array: ");\n    printArray(arr, n);\n    insertionSort(arr, n);\n    printf("Sorted array: ");\n    printArray(arr, n);\n    return 0;\n}',
          python: 'def insertion_sort(arr):\n    for i in range(1, len(arr)):\n        key = arr[i]\n        j = i - 1\n        while j >= 0 and arr[j] > key:\n            arr[j + 1] = arr[j]\n            j -= 1\n        arr[j + 1] = key\n    return arr\n\nn = int(input("Enter the number of elements: "))\narr = list(map(int, input(f"Enter {n} elements:\\n").split()))\nprint("Original array:", *arr)\ninsertion_sort(arr)\nprint("Sorted array:", *arr)',
        },
        samples: [
          { input: "5\n12 11 13 5 6", output: "5 6 11 12 13 \n" },
        ],
      },
    ],
  },

  // ── Exp 2: Merge Sort, Quick Sort, Binary Search ────────────────────────────
  {
    _id: new ObjectId("685b2a1f3c4e8d0012a7b502"),
    subjectId: new ObjectId("685b2a1f3c4e8d0012a7b002"),
    experimentNumber: 2,
    problemStatement:
      "Experiment based on divide and conquers approach. (Merge sort, Quick sort, Binary search)",
    subExperiments: [
      {
        part: "a",
        title: "Merge Sort",
        concepts: ["Divide and Conquer", "Sorting Algorithms", "Recursion"],
        hints: [
          "Divide the array into two halves recursively using the midpoint.",
          "Sort the individual halves and then merge them back together in sorted order.",
          "Use auxiliary arrays to store temp halves during the merge step.",
        ],
        difficulty: "Medium",
        problemStatement: "Implement and analyze the Merge Sort algorithm.",
        theory:
          "Merge Sort is a divide-and-conquer algorithm that recursively splits the array into two halves, sorts each, and merges them. Time: O(n log n) all cases; Space: O(n) auxiliary. Stable sort, well-suited for large datasets and linked lists.",
        algorithm:
          "1. Start\n2. mergeSort(arr, left, right):\n   a. If left >= right: return\n   b. mid = (left+right)/2\n   c. mergeSort(arr, left, mid)\n   d. mergeSort(arr, mid+1, right)\n   e. merge(arr, left, mid, right)\n3. merge(): copy halves to temp arrays L[] and R[], merge back in sorted order\n4. Print sorted array\n5. Stop",
        flowchart: {
          nodes: [
            { id: "1", type: "start",    label: "Start" },
            { id: "2", type: "input",    label: "Read arr[], n" },
            { id: "3", type: "decision", label: "left < right?" },
            { id: "4", type: "process",  label: "mid=(left+right)/2; recurse both halves" },
            { id: "5", type: "process",  label: "merge(arr, left, mid, right)" },
            { id: "6", type: "output",   label: "Print sorted array" },
            { id: "7", type: "end",      label: "Stop" },
          ],
          edges: [
            { source: "1", target: "2" },
            { source: "2", target: "3" },
            { source: "3", target: "4", label: "Yes" },
            { source: "3", target: "6", label: "No" },
            { source: "4", target: "5" },
            { source: "5", target: "6" },
            { source: "6", target: "7" },
          ],
        },
        referenceSolution: {
          c: '#include <stdio.h>\n\nvoid merge(int arr[], int left, int mid, int right) {\n    int i, j, k;\n    int n1 = mid - left + 1;\n    int n2 = right - mid;\n    int L[n1], R[n2];\n    for (i = 0; i < n1; i++) L[i] = arr[left + i];\n    for (j = 0; j < n2; j++) R[j] = arr[mid + 1 + j];\n    i = 0; j = 0; k = left;\n    while (i < n1 && j < n2) {\n        if (L[i] <= R[j]) arr[k++] = L[i++];\n        else              arr[k++] = R[j++];\n    }\n    while (i < n1) arr[k++] = L[i++];\n    while (j < n2) arr[k++] = R[j++];\n}\n\nvoid mergeSort(int arr[], int left, int right) {\n    if (left < right) {\n        int mid = left + (right - left) / 2;\n        mergeSort(arr, left, mid);\n        mergeSort(arr, mid + 1, right);\n        merge(arr, left, mid, right);\n    }\n}\n\nvoid printArray(int arr[], int size) {\n    for (int i = 0; i < size; i++) printf("%d ", arr[i]);\n    printf("\\n");\n}\n\nint main() {\n    int n;\n    printf("Enter the number of elements: ");\n    scanf("%d", &n);\n    int arr[n];\n    printf("Enter %d elements:\\n", n);\n    for (int i = 0; i < n; i++) scanf("%d", &arr[i]);\n    printf("Original array: "); printArray(arr, n);\n    mergeSort(arr, 0, n - 1);\n    printf("Sorted array: ");  printArray(arr, n);\n    return 0;\n}',
          python: 'def merge_sort(arr):\n    if len(arr) <= 1:\n        return arr\n    mid = len(arr) // 2\n    left  = merge_sort(arr[:mid])\n    right = merge_sort(arr[mid:])\n    result = []\n    i = j = 0\n    while i < len(left) and j < len(right):\n        if left[i] <= right[j]:\n            result.append(left[i]); i += 1\n        else:\n            result.append(right[j]); j += 1\n    result.extend(left[i:])\n    result.extend(right[j:])\n    return result\n\nn = int(input("Enter the number of elements: "))\narr = list(map(int, input(f"Enter {n} elements:\\n").split()))\nprint("Original array:", *arr)\nsorted_arr = merge_sort(arr)\nprint("Sorted array:", *sorted_arr)',
        },
        samples: [
          { input: "6\n38 27 43 3 9 82", output: "3 9 27 38 43 82 \n" },
        ],
      },

      {
        part: "b",
        title: "Quick Sort",
        concepts: ["Divide and Conquer", "Sorting Algorithms", "Pivot Partitioning"],
        hints: [
          "Choose a pivot element (e.g., the last element of the array).",
          "Partition the array such that elements smaller than the pivot are on the left and larger on the right.",
          "Recursively apply the quicksort algorithm to the left and right partitions.",
        ],
        difficulty: "Medium",
        problemStatement: "Implement and analyze the Quick Sort algorithm.",
        theory:
          "Quick Sort selects a pivot and partitions the array so smaller elements come before it and larger after. Time: O(n log n) average, O(n²) worst; Space: O(log n) stack. In-place, not stable. Generally faster than Merge Sort in practice due to cache efficiency.",
        algorithm:
          "1. Start\n2. quickSort(arr, low, high):\n   a. If low >= high: return\n   b. pi = partition(arr, low, high)\n   c. quickSort(arr, low, pi-1)\n   d. quickSort(arr, pi+1, high)\n3. partition(): pivot=arr[high]; place smaller elements before pivot; return final pivot index\n4. Print sorted array\n5. Stop",
        flowchart: {
          nodes: [
            { id: "1", type: "start",    label: "Start" },
            { id: "2", type: "input",    label: "Read arr[], n" },
            { id: "3", type: "decision", label: "low < high?" },
            { id: "4", type: "process",  label: "pi = partition(arr, low, high)" },
            { id: "5", type: "process",  label: "Recurse left and right of pivot" },
            { id: "6", type: "output",   label: "Print sorted array" },
            { id: "7", type: "end",      label: "Stop" },
          ],
          edges: [
            { source: "1", target: "2" },
            { source: "2", target: "3" },
            { source: "3", target: "4", label: "Yes" },
            { source: "3", target: "6", label: "No" },
            { source: "4", target: "5" },
            { source: "5", target: "6" },
            { source: "6", target: "7" },
          ],
        },
        referenceSolution: {
          c: '#include <stdio.h>\n\nint partition(int arr[], int low, int high) {\n    int pivot = arr[high];\n    int i = low - 1;\n    for (int j = low; j < high; j++) {\n        if (arr[j] < pivot) {\n            i++;\n            int temp = arr[i]; arr[i] = arr[j]; arr[j] = temp;\n        }\n    }\n    int temp = arr[i + 1]; arr[i + 1] = arr[high]; arr[high] = temp;\n    return i + 1;\n}\n\nvoid quickSort(int arr[], int low, int high) {\n    if (low < high) {\n        int pi = partition(arr, low, high);\n        quickSort(arr, low, pi - 1);\n        quickSort(arr, pi + 1, high);\n    }\n}\n\nvoid printArray(int arr[], int n) {\n    for (int i = 0; i < n; i++) printf("%d ", arr[i]);\n    printf("\\n");\n}\n\nint main() {\n    int n;\n    printf("Enter the number of elements: ");\n    scanf("%d", &n);\n    int arr[n];\n    printf("Enter %d elements:\\n", n);\n    for (int i = 0; i < n; i++) scanf("%d", &arr[i]);\n    printf("Original array: "); printArray(arr, n);\n    quickSort(arr, 0, n - 1);\n    printf("Sorted array: ");  printArray(arr, n);\n    return 0;\n}',
          python: 'def partition(arr, low, high):\n    pivot = arr[high]\n    i = low - 1\n    for j in range(low, high):\n        if arr[j] < pivot:\n            i += 1\n            arr[i], arr[j] = arr[j], arr[i]\n    arr[i + 1], arr[high] = arr[high], arr[i + 1]\n    return i + 1\n\ndef quick_sort(arr, low, high):\n    if low < high:\n        pi = partition(arr, low, high)\n        quick_sort(arr, low, pi - 1)\n        quick_sort(arr, pi + 1, high)\n\nn = int(input("Enter the number of elements: "))\narr = list(map(int, input(f"Enter {n} elements:\\n").split()))\nprint("Original array:", *arr)\nquick_sort(arr, 0, n - 1)\nprint("Sorted array:", *arr)',
        },
        samples: [
          { input: "6\n10 80 30 90 40 50", output: "10 30 40 50 80 90 \n" },
        ],
      },

      {
        part: "c",
        title: "Binary Search",
        concepts: ["Search Algorithms", "Divide and Conquer", "Logarithmic Complexity"],
        hints: [
          "Ensure the array is sorted before applying binary search.",
          "Use low and high pointers to track the current search range.",
          "Calculate the mid index and narrow the search range based on comparing target with array[mid].",
        ],
        difficulty: "Easy",
        problemStatement: "Implement and analyze the Binary Search algorithm.",
        theory:
          "Binary Search finds a target in a sorted array by repeatedly halving the search interval. Time: O(log n); Space: O(1) iterative. The array must be sorted beforehand. If mid equals the target return its index; otherwise narrow the search to the left or right half.",
        algorithm:
          "1. Start\n2. Read sorted arr[], n, key\n3. low=0, high=n-1\n4. While low <= high:\n   a. mid = (low+high)/2\n   b. If arr[mid]==key: return mid (found)\n   c. If arr[mid] < key: low = mid+1\n   d. Else: high = mid-1\n5. Return -1 (not found)\n6. Stop",
        flowchart: {
          nodes: [
            { id: "1",  type: "start",    label: "Start" },
            { id: "2",  type: "input",    label: "Read arr[], n, key" },
            { id: "3",  type: "process",  label: "low=0, high=n-1" },
            { id: "4",  type: "decision", label: "low <= high?" },
            { id: "5",  type: "process",  label: "mid = (low+high)/2" },
            { id: "6",  type: "decision", label: "arr[mid] == key?" },
            { id: "7",  type: "output",   label: "Found at index mid" },
            { id: "8",  type: "process",  label: "Adjust low or high" },
            { id: "9",  type: "output",   label: "Not Found" },
            { id: "10", type: "end",      label: "Stop" },
          ],
          edges: [
            { source: "1",  target: "2" },
            { source: "2",  target: "3" },
            { source: "3",  target: "4" },
            { source: "4",  target: "5",  label: "Yes" },
            { source: "4",  target: "9",  label: "No" },
            { source: "5",  target: "6" },
            { source: "6",  target: "7",  label: "Yes" },
            { source: "6",  target: "8",  label: "No" },
            { source: "7",  target: "10" },
            { source: "8",  target: "4" },
            { source: "9",  target: "10" },
          ],
        },
        referenceSolution: {
          c: '#include <stdio.h>\n\nint binarySearch(int arr[], int n, int key) {\n    int low = 0, high = n - 1;\n    while (low <= high) {\n        int mid = low + (high - low) / 2;\n        if (arr[mid] == key)  return mid;\n        else if (arr[mid] < key) low  = mid + 1;\n        else                     high = mid - 1;\n    }\n    return -1;\n}\n\nint main() {\n    int n, key;\n    printf("Enter the number of elements: ");\n    scanf("%d", &n);\n    int arr[n];\n    printf("Enter %d elements in sorted order:\\n", n);\n    for (int i = 0; i < n; i++) scanf("%d", &arr[i]);\n    printf("Enter the element to search: ");\n    scanf("%d", &key);\n    int result = binarySearch(arr, n, key);\n    if (result != -1) printf("Element found at index %d\\n", result);\n    else              printf("Element not found\\n");\n    return 0;\n}',
          python: 'def binary_search(arr, key):\n    low, high = 0, len(arr) - 1\n    while low <= high:\n        mid = (low + high) // 2\n        if arr[mid] == key:\n            return mid\n        elif arr[mid] < key:\n            low = mid + 1\n        else:\n            high = mid - 1\n    return -1\n\nn = int(input("Enter the number of elements: "))\narr = list(map(int, input(f"Enter {n} elements in sorted order:\\n").split()))\nkey = int(input("Enter the element to search: "))\nresult = binary_search(arr, key)\nif result != -1:\n    print(f"Element found at index {result}")\nelse:\n    print("Element not found")',
        },
        samples: [
          { input: "7\n2 3 4 10 40 50 60\n10", output: "Element found at index 3\n" },
          { input: "5\n1 3 5 7 9\n6",           output: "Element not found\n" },
        ],
      },
    ],
  },

  // ── Exp 3: Dijkstra's, Fractional Knapsack, MST ─────────────────────────────
  {
    _id: new ObjectId("685b2a1f3c4e8d0012a7b503"),
    subjectId: new ObjectId("685b2a1f3c4e8d0012a7b002"),
    experimentNumber: 3,
    problemStatement:
      "Experiment based on greedy approach. (Single source shortest path - Dijkstra, Fractional Knapsack problem, Minimum cost spanning trees - Kruskal and Prim's algorithm)",
    subExperiments: [
      {
        part: "a",
        title: "Dijkstra's Algorithm",
        concepts: ["Graph Algorithms", "Single Source Shortest Path", "Greedy Method"],
        hints: [
          "Initialize distances of all vertices as infinity, and source vertex distance as 0.",
          "Repeatedly choose the unvisited vertex with the minimum distance.",
          "Relax the neighboring vertices of the selected vertex by updating their shortest path distance.",
        ],
        difficulty: "Medium",
        problemStatement:
          "Implement and analyze Dijkstra's Algorithm for Single Source Shortest Path.",
        theory:
          "Dijkstra's algorithm finds shortest paths from a source vertex to all others in a weighted graph with non-negative edges using a greedy approach. At each step it picks the unvisited vertex with the smallest known distance and relaxes its neighbors. Time: O(V²) with matrix, O((V+E) log V) with priority queue.",
        algorithm:
          "1. Start\n2. Read graph, source src\n3. dist[]=INF, dist[src]=0, visited[]=false\n4. Repeat V times:\n   a. Pick unvisited u with min dist[u], mark visited\n   b. For each neighbor v of u: if dist[u]+w < dist[v], update dist[v]\n5. Print dist[]\n6. Stop",
        flowchart: {
          nodes: [
            { id: "1", type: "start",    label: "Start" },
            { id: "2", type: "input",    label: "Read graph, src" },
            { id: "3", type: "process",  label: "dist[]=INF, dist[src]=0, visited[]=false" },
            { id: "4", type: "process",  label: "Pick unvisited u with min dist; mark visited" },
            { id: "5", type: "process",  label: "Relax neighbors of u" },
            { id: "6", type: "decision", label: "All visited?" },
            { id: "7", type: "output",   label: "Print dist[]" },
            { id: "8", type: "end",      label: "Stop" },
          ],
          edges: [
            { source: "1", target: "2" },
            { source: "2", target: "3" },
            { source: "3", target: "4" },
            { source: "4", target: "5" },
            { source: "5", target: "6" },
            { source: "6", target: "4", label: "No" },
            { source: "6", target: "7", label: "Yes" },
            { source: "7", target: "8" },
          ],
        },
        referenceSolution: {
          c: '#include <stdio.h>\n#define V 5\n#define INF 99999\n\nint minDistance(int dist[], int visited[]) {\n    int min = INF, minIndex = -1;\n    for (int v = 0; v < V; v++)\n        if (!visited[v] && dist[v] < min) { min = dist[v]; minIndex = v; }\n    return minIndex;\n}\n\nvoid dijkstra(int graph[V][V], int src) {\n    int dist[V], visited[V];\n    for (int i = 0; i < V; i++) { dist[i] = INF; visited[i] = 0; }\n    dist[src] = 0;\n    for (int count = 0; count < V - 1; count++) {\n        int u = minDistance(dist, visited);\n        visited[u] = 1;\n        for (int v = 0; v < V; v++)\n            if (!visited[v] && graph[u][v] && dist[u] != INF &&\n                dist[u] + graph[u][v] < dist[v])\n                dist[v] = dist[u] + graph[u][v];\n    }\n    printf("\\nVertex\\tDistance from Source\\n");\n    for (int i = 0; i < V; i++) printf("%d\\t%d\\n", i, dist[i]);\n}\n\nint main() {\n    int graph[V][V] = {\n        {0, 10, 0, 5, 0},\n        {0,  0, 1, 2, 0},\n        {0,  0, 0, 0, 4},\n        {0,  3, 9, 0, 2},\n        {7,  0, 6, 0, 0}\n    };\n    int source;\n    printf("Enter source vertex (0-%d): ", V - 1);\n    scanf("%d", &source);\n    dijkstra(graph, source);\n    return 0;\n}',
          python: 'import heapq\n\nINF = float("inf")\n\ndef dijkstra(graph, src, V):\n    dist = [INF] * V\n    dist[src] = 0\n    pq = [(0, src)]   # (distance, vertex)\n    visited = [False] * V\n    while pq:\n        d, u = heapq.heappop(pq)\n        if visited[u]:\n            continue\n        visited[u] = True\n        for v in range(V):\n            if graph[u][v] and not visited[v] and dist[u] + graph[u][v] < dist[v]:\n                dist[v] = dist[u] + graph[u][v]\n                heapq.heappush(pq, (dist[v], v))\n    return dist\n\nV = 5\ngraph = [\n    [0, 10, 0, 5, 0],\n    [0,  0, 1, 2, 0],\n    [0,  0, 0, 0, 4],\n    [0,  3, 9, 0, 2],\n    [7,  0, 6, 0, 0],\n]\nsrc = int(input(f"Enter source vertex (0-{V-1}): "))\ndist = dijkstra(graph, src, V)\nprint("\\nVertex\\tDistance from Source")\nfor i, d in enumerate(dist):\n    print(f"{i}\\t{d}")',
        },
        samples: [
          {
            input: "0",
            output: "Vertex\tDistance from Source\n0\t0\n1\t8\n2\t9\n3\t5\n4\t7\n",
          },
        ],
      },

      {
        part: "b",
        title: "Fractional Knapsack Problem",
        concepts: ["Greedy Method", "Optimization Algorithms", "Fractional Relaxation"],
        hints: [
          "Calculate the value-to-weight ratio for each item.",
          "Sort the items in descending order of their value-to-weight ratios.",
          "Greedily choose the items with the highest ratios, taking fractions of items if capacity is reached.",
        ],
        difficulty: "Medium",
        problemStatement: "Implement and analyze the Fractional Knapsack Problem.",
        theory:
          "Greedy strategy: sort items by value/weight ratio descending, take as much of each highest-ratio item as possible (fractions allowed). Time: O(n log n). Unlike 0/1 Knapsack, the greedy approach is provably optimal here.",
        algorithm:
          "1. Start\n2. Read n items (weight, value), capacity W\n3. Compute ratio = value/weight per item; sort descending by ratio\n4. For each item: if it fits fully take it; else take fraction to fill W\n5. Print total value\n6. Stop",
        flowchart: {
          nodes: [
            { id: "1", type: "start",    label: "Start" },
            { id: "2", type: "input",    label: "Read items, W" },
            { id: "3", type: "process",  label: "Compute ratios; sort descending" },
            { id: "4", type: "decision", label: "Items left & W > 0?" },
            { id: "5", type: "process",  label: "Take full or fractional item" },
            { id: "6", type: "output",   label: "Print total value" },
            { id: "7", type: "end",      label: "Stop" },
          ],
          edges: [
            { source: "1", target: "2" },
            { source: "2", target: "3" },
            { source: "3", target: "4" },
            { source: "4", target: "5", label: "Yes" },
            { source: "4", target: "6", label: "No" },
            { source: "5", target: "4" },
            { source: "6", target: "7" },
          ],
        },
        referenceSolution: {
          c: '#include <stdio.h>\n\nstruct Item { int weight; int profit; float ratio; };\n\nvoid sortItems(struct Item items[], int n) {\n    struct Item temp;\n    for (int i = 0; i < n - 1; i++)\n        for (int j = i + 1; j < n; j++)\n            if (items[i].ratio < items[j].ratio) {\n                temp = items[i]; items[i] = items[j]; items[j] = temp;\n            }\n}\n\nint main() {\n    int n;\n    float capacity, totalProfit = 0.0;\n    printf("Enter the number of items: ");\n    scanf("%d", &n);\n    struct Item items[n];\n    for (int i = 0; i < n; i++) {\n        printf("\\nEnter weight and profit of item %d: ", i + 1);\n        scanf("%d %d", &items[i].weight, &items[i].profit);\n        items[i].ratio = (float)items[i].profit / items[i].weight;\n    }\n    printf("\\nEnter the capacity of knapsack: ");\n    scanf("%f", &capacity);\n    sortItems(items, n);\n    for (int i = 0; i < n; i++) {\n        if (capacity >= items[i].weight) {\n            capacity -= items[i].weight;\n            totalProfit += items[i].profit;\n        } else {\n            totalProfit += items[i].ratio * capacity;\n            capacity = 0;\n            break;\n        }\n    }\n    printf("\\nMaximum Profit = %.2f\\n", totalProfit);\n    return 0;\n}',
          python: 'def fractional_knapsack(items, capacity):\n    # items: list of (weight, profit)\n    items_with_ratio = sorted(items, key=lambda x: x[1] / x[0], reverse=True)\n    total_profit = 0.0\n    for weight, profit in items_with_ratio:\n        if capacity <= 0:\n            break\n        if weight <= capacity:\n            total_profit += profit\n            capacity -= weight\n        else:\n            total_profit += (profit / weight) * capacity\n            capacity = 0\n    return total_profit\n\nn = int(input("Enter the number of items: "))\nitems = []\nfor i in range(n):\n    w, p = map(int, input(f"Enter weight and profit of item {i+1}: ").split())\n    items.append((w, p))\ncapacity = float(input("Enter the capacity of knapsack: "))\nresult = fractional_knapsack(items, capacity)\nprint(f"\\nMaximum Profit = {result:.2f}")',
        },
        samples: [
          {
            input: "3\n10 60\n20 100\n30 120\n50",
            output: "Maximum Profit = 240.00\n",
          },
        ],
      },

      {
        part: "c",
        title: "Minimum Cost Spanning Trees",
        concepts: ["Graph Algorithms", "Minimum Spanning Tree", "Greedy Method"],
        hints: [
          "For Kruskal's, sort all edges by weight and add them to the MST as long as they don't form a cycle.",
          "For Prim's, start from an arbitrary vertex and grow the tree by adding the minimum weight edge connecting the tree to unvisited vertices.",
          "An MST of a graph with V vertices always contains exactly V-1 edges and no cycles.",
        ],
        difficulty: "Hard",
        problemStatement:
          "Implement and analyze Kruskal's and Prim's algorithms for Minimum Cost Spanning Trees.",
        theory:
          "An MST spans all vertices with minimum total edge weight. Kruskal's: sort edges by weight, add non-cycle edges using Union-Find. Time: O(E log E). Prim's: grow MST from a start vertex by always adding the cheapest connecting edge. Time: O(V²) matrix, O(E log V) heap.",
        algorithm:
          "Kruskal's:\n1. Sort edges by weight\n2. For each edge (u,v): if find(u)!=find(v), add to MST, union(u,v)\n\nPrim's:\n1. key[]=INF, key[0]=0, inMST[]=false\n2. Repeat V times: pick min-key unvisited u, mark inMST\n3. Update keys of u's unvisited neighbors\n4. Print MST total cost",
        flowchart: {
          nodes: [
            { id: "1", type: "start",    label: "Start" },
            { id: "2", type: "input",    label: "Read graph (V, E)" },
            { id: "3", type: "process",  label: "Sort edges by weight" },
            { id: "4", type: "decision", label: "Edge forms cycle?" },
            { id: "5", type: "process",  label: "Add to MST (union)" },
            { id: "6", type: "decision", label: "MST has V-1 edges?" },
            { id: "7", type: "output",   label: "Print MST and total cost" },
            { id: "8", type: "end",      label: "Stop" },
          ],
          edges: [
            { source: "1", target: "2" },
            { source: "2", target: "3" },
            { source: "3", target: "4" },
            { source: "4", target: "3", label: "Yes (skip)" },
            { source: "4", target: "5", label: "No" },
            { source: "5", target: "6" },
            { source: "6", target: "7", label: "Yes" },
            { source: "6", target: "3", label: "No" },
            { source: "7", target: "8" },
          ],
        },
        referenceSolution: {
          c: '#include <stdio.h>\n\n/* ===== KRUSKAL\'S ALGORITHM ===== */\nstruct Edge { int src, dest, weight; };\n\nint find(int parent[], int i) {\n    while (parent[i] != i) i = parent[i];\n    return i;\n}\nvoid unionSets(int parent[], int x, int y) {\n    parent[find(parent, x)] = find(parent, y);\n}\nvoid sortEdges(struct Edge edges[], int E) {\n    struct Edge temp;\n    for (int i = 0; i < E - 1; i++)\n        for (int j = i + 1; j < E; j++)\n            if (edges[i].weight > edges[j].weight) {\n                temp = edges[i]; edges[i] = edges[j]; edges[j] = temp;\n            }\n}\nvoid kruskal() {\n    int V, E;\n    printf("Enter number of vertices: "); scanf("%d", &V);\n    printf("Enter number of edges: ");    scanf("%d", &E);\n    struct Edge edges[E];\n    printf("Enter source destination weight:\\n");\n    for (int i = 0; i < E; i++)\n        scanf("%d %d %d", &edges[i].src, &edges[i].dest, &edges[i].weight);\n    sortEdges(edges, E);\n    int parent[V];\n    for (int i = 0; i < V; i++) parent[i] = i;\n    int cost = 0;\n    printf("\\nKruskal MST:\\n");\n    for (int i = 0; i < E; i++) {\n        int x = find(parent, edges[i].src);\n        int y = find(parent, edges[i].dest);\n        if (x != y) {\n            printf("%d -- %d == %d\\n", edges[i].src, edges[i].dest, edges[i].weight);\n            cost += edges[i].weight;\n            unionSets(parent, x, y);\n        }\n    }\n    printf("Total Cost = %d\\n", cost);\n}\n\n/* ===== PRIM\'S ALGORITHM ===== */\n#define PV 5\n#define PINF 99999\nint minKey(int key[], int mstSet[]) {\n    int min = PINF, minIndex = 0;\n    for (int v = 0; v < PV; v++)\n        if (!mstSet[v] && key[v] < min) { min = key[v]; minIndex = v; }\n    return minIndex;\n}\nvoid prim() {\n    int graph[PV][PV] = {\n        {0,2,0,6,0},{2,0,3,8,5},{0,3,0,0,7},{6,8,0,0,9},{0,5,7,9,0}\n    };\n    int parent[PV], key[PV], mstSet[PV];\n    for (int i = 0; i < PV; i++) { key[i] = PINF; mstSet[i] = 0; }\n    key[0] = 0; parent[0] = -1;\n    for (int count = 0; count < PV - 1; count++) {\n        int u = minKey(key, mstSet);\n        mstSet[u] = 1;\n        for (int v = 0; v < PV; v++)\n            if (graph[u][v] && !mstSet[v] && graph[u][v] < key[v]) {\n                parent[v] = u; key[v] = graph[u][v];\n            }\n    }\n    int cost = 0;\n    printf("\\nPrim MST:\\nEdge\\tWeight\\n");\n    for (int i = 1; i < PV; i++) {\n        printf("%d - %d\\t%d\\n", parent[i], i, graph[i][parent[i]]);\n        cost += graph[i][parent[i]];\n    }\n    printf("Total Cost = %d\\n", cost);\n}\n\nint main() {\n    int choice;\n    printf("1. Kruskal\\n2. Prim\\nEnter choice: ");\n    scanf("%d", &choice);\n    if (choice == 1) kruskal();\n    else if (choice == 2) prim();\n    else printf("Invalid choice\\n");\n    return 0;\n}',
          python: '# ===== KRUSKAL\'S ALGORITHM =====\ndef find(parent, i):\n    while parent[i] != i:\n        i = parent[i]\n    return i\n\ndef union(parent, x, y):\n    parent[find(parent, x)] = find(parent, y)\n\ndef kruskal(V, edges):\n    edges.sort(key=lambda e: e[2])\n    parent = list(range(V))\n    cost = 0\n    print("\\nKruskal MST:")\n    for u, v, w in edges:\n        pu, pv = find(parent, u), find(parent, v)\n        if pu != pv:\n            print(f"{u} -- {v} == {w}")\n            cost += w\n            union(parent, pu, pv)\n    print(f"Total Cost = {cost}")\n\n# ===== PRIM\'S ALGORITHM =====\ndef prim(graph):\n    V = len(graph)\n    INF = float("inf")\n    key = [INF] * V\n    parent = [-1] * V\n    in_mst = [False] * V\n    key[0] = 0\n    for _ in range(V - 1):\n        u = min((v for v in range(V) if not in_mst[v]), key=lambda v: key[v])\n        in_mst[u] = True\n        for v in range(V):\n            if graph[u][v] and not in_mst[v] and graph[u][v] < key[v]:\n                key[v] = graph[u][v]\n                parent[v] = u\n    cost = 0\n    print("\\nPrim MST:\\nEdge\\tWeight")\n    for i in range(1, V):\n        print(f"{parent[i]} - {i}\\t{graph[i][parent[i]]}")\n        cost += graph[i][parent[i]]\n    print(f"Total Cost = {cost}")\n\nchoice = int(input("1. Kruskal\\n2. Prim\\nEnter choice: "))\nif choice == 1:\n    V = int(input("Enter number of vertices: "))\n    E = int(input("Enter number of edges: "))\n    edges = []\n    print("Enter source destination weight:")\n    for _ in range(E):\n        u, v, w = map(int, input().split())\n        edges.append((u, v, w))\n    kruskal(V, edges)\nelif choice == 2:\n    graph = [\n        [0,2,0,6,0],[2,0,3,8,5],[0,3,0,0,7],[6,8,0,0,9],[0,5,7,9,0]\n    ]\n    prim(graph)\nelse:\n    print("Invalid choice")',
        },
        samples: [
          {
            input: "1\n4 5\n0 1 10\n0 2 6\n0 3 5\n1 3 15\n2 3 4",
            output: "Kruskal MST:\n2 -- 3 == 4\n0 -- 3 == 5\n0 -- 1 == 10\nTotal Cost = 19\n",
          },
        ],
      },
    ],
  },

  // ── Exp 4: Floyd-Warshall & 0/1 Knapsack ────────────────────────────────────
  {
    _id: new ObjectId("685b2a1f3c4e8d0012a7b504"),
    subjectId: new ObjectId("685b2a1f3c4e8d0012a7b002"),
    experimentNumber: 4,
    problemStatement:
      "Experiment using dynamic programming approach (All pair shortest path - Floyd Warshall, 0/1 knapsack)",
    subExperiments: [
      {
        part: "a",
        title: "Floyd-Warshall Algorithm",
        concepts: ["Dynamic Programming", "All-Pairs Shortest Path", "Graph Algorithms"],
        hints: [
          "Initialize the distance matrix with direct edge weights between vertices.",
          "Iteratively update the shortest distance between all pairs of vertices using every vertex 'k' as an intermediate node.",
          "Check if distance from i to j can be minimized by passing through k: dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]).",
        ],
        difficulty: "Hard",
        problemStatement:
          "Implement and analyze the All-Pairs Shortest Path using the Floyd-Warshall algorithm.",
        theory:
          "Floyd-Warshall finds shortest paths between all vertex pairs using DP. It iterates over each vertex k as an intermediate and updates dist[i][j] = min(dist[i][j], dist[i][k]+dist[k][j]). Time: O(V³); Space: O(V²). Handles negative edges but not negative cycles.",
        algorithm:
          "1. Start\n2. Read graph[][], V\n3. Initialize dist[][] = graph[][]\n4. For k=0 to V-1:\n   For i=0 to V-1:\n     For j=0 to V-1:\n       dist[i][j] = min(dist[i][j], dist[i][k]+dist[k][j])\n5. Print dist[][]\n6. Stop",
        flowchart: {
          nodes: [
            { id: "1", type: "start",   label: "Start" },
            { id: "2", type: "input",   label: "Read graph[][], V" },
            { id: "3", type: "process", label: "dist[][] = graph[][]" },
            { id: "4", type: "process", label: "Triple loop: update dist[i][j] via k" },
            { id: "5", type: "output",  label: "Print dist[][]" },
            { id: "6", type: "end",     label: "Stop" },
          ],
          edges: [
            { source: "1", target: "2" },
            { source: "2", target: "3" },
            { source: "3", target: "4" },
            { source: "4", target: "5" },
            { source: "5", target: "6" },
          ],
        },
        referenceSolution: {
          c: '#include <stdio.h>\n#define V 4\n#define INF 99999\n\nint main() {\n    int graph[V][V] = {\n        {0,   5,   INF, 10},\n        {INF, 0,   3,   INF},\n        {INF, INF, 0,   1},\n        {INF, INF, INF, 0}\n    };\n    int dist[V][V];\n    for (int i = 0; i < V; i++)\n        for (int j = 0; j < V; j++)\n            dist[i][j] = graph[i][j];\n    for (int k = 0; k < V; k++)\n        for (int i = 0; i < V; i++)\n            for (int j = 0; j < V; j++)\n                if (dist[i][k] != INF && dist[k][j] != INF &&\n                    dist[i][k] + dist[k][j] < dist[i][j])\n                    dist[i][j] = dist[i][k] + dist[k][j];\n    printf("All-Pairs Shortest Path Matrix:\\n");\n    for (int i = 0; i < V; i++) {\n        for (int j = 0; j < V; j++) {\n            if (dist[i][j] == INF) printf("INF\\t");\n            else                   printf("%d\\t", dist[i][j]);\n        }\n        printf("\\n");\n    }\n    return 0;\n}',
          python: 'INF = float("inf")\n\ndef floyd_warshall(graph):\n    V = len(graph)\n    dist = [row[:] for row in graph]  # deep copy\n    for k in range(V):\n        for i in range(V):\n            for j in range(V):\n                if dist[i][k] != INF and dist[k][j] != INF:\n                    dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])\n    return dist\n\ngraph = [\n    [0,   5,   INF, 10],\n    [INF, 0,   3,   INF],\n    [INF, INF, 0,   1],\n    [INF, INF, INF, 0],\n]\ndist = floyd_warshall(graph)\nprint("All-Pairs Shortest Path Matrix:")\nfor row in dist:\n    print("\\t".join("INF" if x == INF else str(x) for x in row))',
        },
        samples: [
          {
            input: "0 5 99999 10\n99999 0 3 99999\n99999 99999 0 1\n99999 99999 99999 0",
            output: "All-Pairs Shortest Path Matrix:\n0\t5\t8\t9\nINF\t0\t3\t4\nINF\tINF\t0\t1\nINF\tINF\tINF\t0\n",
          },
        ],
      },

      {
        part: "b",
        title: "0/1 Knapsack Problem",
        concepts: ["Dynamic Programming", "Optimization Algorithms", "Subproblem Overlap"],
        hints: [
          "Each item can either be included or excluded; fractional items are not allowed.",
          "Build a 2D DP table where dp[i][w] represents the maximum value using the first 'i' items with capacity 'w'.",
          "The recurrence relation is: dp[i][w] = max(val[i-1] + dp[i-1][w-wt[i-1]], dp[i-1][w]).",
        ],
        difficulty: "Hard",
        problemStatement: "Implement and analyze the 0/1 Knapsack problem.",
        theory:
          "0/1 Knapsack uses DP: dp[i][w] = max value using first i items with capacity w. Each item is taken whole or not at all. Time: O(nW); Space: O(nW). Answer is dp[n][W].",
        algorithm:
          "1. Start\n2. Read n items (weight, value), capacity W\n3. Init dp[n+1][W+1] = 0\n4. For i=1 to n, for w=1 to W:\n   If wt[i-1]<=w: dp[i][w]=max(val[i-1]+dp[i-1][w-wt[i-1]], dp[i-1][w])\n   Else: dp[i][w]=dp[i-1][w]\n5. Print dp[n][W]\n6. Stop",
        flowchart: {
          nodes: [
            { id: "1", type: "start",    label: "Start" },
            { id: "2", type: "input",    label: "Read wt[], val[], n, W" },
            { id: "3", type: "process",  label: "Init dp[n+1][W+1] = 0" },
            { id: "4", type: "decision", label: "wt[i-1] <= w?" },
            { id: "5", type: "process",  label: "dp[i][w] = max(include, exclude)" },
            { id: "6", type: "process",  label: "dp[i][w] = dp[i-1][w]" },
            { id: "7", type: "output",   label: "Print dp[n][W]" },
            { id: "8", type: "end",      label: "Stop" },
          ],
          edges: [
            { source: "1", target: "2" },
            { source: "2", target: "3" },
            { source: "3", target: "4" },
            { source: "4", target: "5", label: "Yes" },
            { source: "4", target: "6", label: "No" },
            { source: "5", target: "7" },
            { source: "6", target: "7" },
            { source: "7", target: "8" },
          ],
        },
        referenceSolution: {
          c: '#include <stdio.h>\n\nint max(int a, int b) { return (a > b) ? a : b; }\n\nint main() {\n    int n, W;\n    printf("Enter number of items: ");    scanf("%d", &n);\n    int weight[n], value[n];\n    printf("Enter weights of items:\\n");\n    for (int i = 0; i < n; i++) scanf("%d", &weight[i]);\n    printf("Enter values of items:\\n");\n    for (int i = 0; i < n; i++) scanf("%d", &value[i]);\n    printf("Enter knapsack capacity: ");  scanf("%d", &W);\n    int dp[n + 1][W + 1];\n    for (int i = 0; i <= n; i++) {\n        for (int w = 0; w <= W; w++) {\n            if (i == 0 || w == 0)\n                dp[i][w] = 0;\n            else if (weight[i - 1] <= w)\n                dp[i][w] = max(value[i-1] + dp[i-1][w-weight[i-1]], dp[i-1][w]);\n            else\n                dp[i][w] = dp[i-1][w];\n        }\n    }\n    printf("\\nMaximum Profit = %d\\n", dp[n][W]);\n    return 0;\n}',
          python: 'def knapsack_01(weights, values, W):\n    n = len(weights)\n    dp = [[0] * (W + 1) for _ in range(n + 1)]\n    for i in range(1, n + 1):\n        for w in range(W + 1):\n            if weights[i-1] <= w:\n                dp[i][w] = max(values[i-1] + dp[i-1][w - weights[i-1]], dp[i-1][w])\n            else:\n                dp[i][w] = dp[i-1][w]\n    return dp[n][W]\n\nn = int(input("Enter number of items: "))\nweights = list(map(int, input("Enter weights of items:\\n").split()))\nvalues  = list(map(int, input("Enter values of items:\\n").split()))\nW = int(input("Enter knapsack capacity: "))\nprint(f"\\nMaximum Profit = {knapsack_01(weights, values, W)}")',
        },
        samples: [
          {
            input: "4\n2 2 3 1\n6 10 12 5\n5",
            output: "Maximum Profit = 22\n",
          },
        ],
      },
    ],
  },

  // ── Exp 5: TSP & LCS ──────────────────────────────────────────────────────────
  {
    _id: new ObjectId("685b2a1f3c4e8d0012a7b505"),
    subjectId: new ObjectId("685b2a1f3c4e8d0012a7b002"),
    experimentNumber: 5,
    problemStatement:
      "Travelling salesperson problem, Longest common subsequence",
    subExperiments: [
      {
        part: "a",
        title: "Travelling Salesperson Problem",
        concepts: ["NP-Hard Problems", "Dynamic Programming with Bitmasking", "Graph Traversals"],
        hints: [
          "Use bitmasking to represent the set of visited cities dynamically.",
          "Define dp[mask][i] as the minimum cost to visit all cities in the bitmask ending at city 'i'.",
          "The base case is when all cities are visited; return to the starting city to complete the round-trip.",
        ],
        difficulty: "Hard",
        problemStatement:
          "Implement and analyze the Travelling Salesperson Problem.",
        theory:
          "TSP finds the shortest round-trip visiting every city exactly once. NP-Hard. Brute-force: O((n-1)!). Held-Karp bitmask DP: dp[mask][i] = min cost to visit cities in mask ending at i. Time: O(2^n × n²).",
        algorithm:
          "1. Start\n2. Read n cities, cost[][] matrix\n3. dp[1][0]=0, all others INF\n4. For each mask; for each city i in mask; for each j not in mask:\n   dp[mask|(1<<j)][j] = min(dp[...][j], dp[mask][i]+cost[i][j])\n5. ans = min over all i of dp[(1<<n)-1][i]+cost[i][0]\n6. Print ans\n7. Stop",
        flowchart: {
          nodes: [
            { id: "1", type: "start",   label: "Start" },
            { id: "2", type: "input",   label: "Read cost[][], n" },
            { id: "3", type: "process", label: "Init dp[mask][i]=INF; dp[1][0]=0" },
            { id: "4", type: "process", label: "Fill dp via bitmask transitions" },
            { id: "5", type: "process", label: "ans = min over dp[(1<<n)-1][i]+cost[i][0]" },
            { id: "6", type: "output",  label: "Print minimum tour cost" },
            { id: "7", type: "end",     label: "Stop" },
          ],
          edges: [
            { source: "1", target: "2" },
            { source: "2", target: "3" },
            { source: "3", target: "4" },
            { source: "4", target: "5" },
            { source: "5", target: "6" },
            { source: "6", target: "7" },
          ],
        },
        referenceSolution: {
          c: '#include <stdio.h>\n#include <limits.h>\n\n#define N 4\n#define INF INT_MAX\n\nint dp[1 << N][N];\n\nint tsp(int cost[N][N]) {\n    // Initialize DP table\n    for (int mask = 0; mask < (1 << N); mask++)\n        for (int i = 0; i < N; i++)\n            dp[mask][i] = INF;\n    dp[1][0] = 0;\n\n    for (int mask = 1; mask < (1 << N); mask++) {\n        for (int u = 0; u < N; u++) {\n            if (!(mask & (1 << u)) || dp[mask][u] == INF) continue;\n            for (int v = 0; v < N; v++) {\n                if (mask & (1 << v) || cost[u][v] == 0) continue;\n                int newMask = mask | (1 << v);\n                if (dp[mask][u] + cost[u][v] < dp[newMask][v])\n                    dp[newMask][v] = dp[mask][u] + cost[u][v];\n            }\n        }\n    }\n\n    int ans = INF;\n    int full = (1 << N) - 1;\n    for (int i = 1; i < N; i++)\n        if (dp[full][i] != INF && cost[i][0] != 0)\n            if (dp[full][i] + cost[i][0] < ans)\n                ans = dp[full][i] + cost[i][0];\n    return ans;\n}\n\nint main() {\n    int cost[N][N] = {\n        {0, 10, 15, 20},\n        {10, 0, 35, 25},\n        {15, 35, 0, 30},\n        {20, 25, 30, 0}\n    };\n    printf("Minimum TSP tour cost = %d\\n", tsp(cost));\n    return 0;\n}',
          python: 'INF = float("inf")\n\ndef tsp(cost):\n    n = len(cost)\n    # dp[mask][i] = min cost to visit cities in mask, ending at city i\n    dp = [[INF] * n for _ in range(1 << n)]\n    dp[1][0] = 0\n    for mask in range(1, 1 << n):\n        for u in range(n):\n            if not (mask & (1 << u)) or dp[mask][u] == INF:\n                continue\n            for v in range(n):\n                if mask & (1 << v) or cost[u][v] == 0:\n                    continue\n                new_mask = mask | (1 << v)\n                dp[new_mask][v] = min(dp[new_mask][v], dp[mask][u] + cost[u][v])\n    full = (1 << n) - 1\n    ans = min(\n        dp[full][i] + cost[i][0]\n        for i in range(1, n)\n        if dp[full][i] != INF and cost[i][0] != 0\n    )\n    return ans\n\ncost = [\n    [0, 10, 15, 20],\n    [10, 0, 35, 25],\n    [15, 35,  0, 30],\n    [20, 25, 30,  0],\n]\nprint(f"Minimum TSP tour cost = {tsp(cost)}")',
        },
        samples: [
          {
            input: "4\n0 10 15 20\n10 0 35 25\n15 35 0 30\n20 25 30 0",
            output: "Minimum TSP tour cost = 80\n",
          },
        ],
      },

      {
        part: "b",
        title: "Longest Common Subsequence",
        concepts: ["Dynamic Programming", "String Algorithms", "Subproblem Overlap"],
        hints: [
          "Build a 2D DP table where dp[i][j] holds the LCS length of the first i characters of X and first j characters of Y.",
          "If characters match, dp[i][j] = 1 + dp[i-1][j-1]; otherwise dp[i][j] = max(dp[i-1][j], dp[i][j-1]).",
          "Trace back through the DP table to reconstruct the actual LCS string.",
        ],
        difficulty: "Medium",
        problemStatement:
          "Implement and analyze the Longest Common Subsequence (LCS) algorithm.",
        theory:
          "LCS finds the longest sequence present in both strings (not necessarily contiguous). DP recurrence: if X[i]==Y[j], dp[i][j]=1+dp[i-1][j-1]; else dp[i][j]=max(dp[i-1][j], dp[i][j-1]). Time: O(mn); Space: O(mn). Answer is dp[m][n].",
        algorithm:
          "1. Start\n2. Read strings X (length m) and Y (length n)\n3. Init dp[m+1][n+1] = 0\n4. For i=1 to m, for j=1 to n:\n   If X[i-1]==Y[j-1]: dp[i][j]=1+dp[i-1][j-1]\n   Else: dp[i][j]=max(dp[i-1][j], dp[i][j-1])\n5. Print dp[m][n]\n6. Stop",
        flowchart: {
          nodes: [
            { id: "1", type: "start",    label: "Start" },
            { id: "2", type: "input",    label: "Read strings X, Y" },
            { id: "3", type: "process",  label: "Init dp[m+1][n+1] = 0" },
            { id: "4", type: "decision", label: "X[i-1] == Y[j-1]?" },
            { id: "5", type: "process",  label: "dp[i][j] = 1 + dp[i-1][j-1]" },
            { id: "6", type: "process",  label: "dp[i][j] = max(dp[i-1][j], dp[i][j-1])" },
            { id: "7", type: "output",   label: "Print dp[m][n] (LCS length)" },
            { id: "8", type: "end",      label: "Stop" },
          ],
          edges: [
            { source: "1", target: "2" },
            { source: "2", target: "3" },
            { source: "3", target: "4" },
            { source: "4", target: "5", label: "Yes" },
            { source: "4", target: "6", label: "No" },
            { source: "5", target: "7" },
            { source: "6", target: "7" },
            { source: "7", target: "8" },
          ],
        },
        referenceSolution: {
          c: '#include <stdio.h>\n#include <string.h>\n\n#define MAX 100\n\nint max(int a, int b) { return a > b ? a : b; }\n\nvoid lcs(char X[], char Y[]) {\n    int m = strlen(X);\n    int n = strlen(Y);\n    int dp[MAX][MAX];\n\n    for (int i = 0; i <= m; i++) {\n        for (int j = 0; j <= n; j++) {\n            if (i == 0 || j == 0)\n                dp[i][j] = 0;\n            else if (X[i-1] == Y[j-1])\n                dp[i][j] = 1 + dp[i-1][j-1];\n            else\n                dp[i][j] = max(dp[i-1][j], dp[i][j-1]);\n        }\n    }\n\n    // Reconstruct LCS\n    int len = dp[m][n];\n    char lcsStr[len + 1];\n    lcsStr[len] = \'\\0\';\n    int i = m, j = n;\n    while (i > 0 && j > 0) {\n        if (X[i-1] == Y[j-1]) { lcsStr[--len] = X[i-1]; i--; j--; }\n        else if (dp[i-1][j] > dp[i][j-1]) i--;\n        else j--;\n    }\n\n    printf("LCS Length = %d\\n", dp[m][n]);\n    printf("LCS String = %s\\n", lcsStr);\n}\n\nint main() {\n    char X[MAX], Y[MAX];\n    printf("Enter first string:  "); scanf("%s", X);\n    printf("Enter second string: "); scanf("%s", Y);\n    lcs(X, Y);\n    return 0;\n}',
          python: 'def lcs(X, Y):\n    m, n = len(X), len(Y)\n    dp = [[0] * (n + 1) for _ in range(m + 1)]\n    for i in range(1, m + 1):\n        for j in range(1, n + 1):\n            if X[i-1] == Y[j-1]:\n                dp[i][j] = 1 + dp[i-1][j-1]\n            else:\n                dp[i][j] = max(dp[i-1][j], dp[i][j-1])\n    # Reconstruct LCS\n    i, j = m, n\n    result = []\n    while i > 0 and j > 0:\n        if X[i-1] == Y[j-1]:\n            result.append(X[i-1])\n            i -= 1; j -= 1\n        elif dp[i-1][j] > dp[i][j-1]:\n            i -= 1\n        else:\n            j -= 1\n    lcs_str = "".join(reversed(result))\n    return dp[m][n], lcs_str\n\nX = input("Enter first string:  ")\nY = input("Enter second string: ")\nlength, lcs_str = lcs(X, Y)\nprint(f"LCS Length = {length}")\nprint(f"LCS String = {lcs_str}")',
        },
        samples: [
          {
            input: "ABCBDAB\nBDCABA",
            output: "LCS Length = 4\nLCS String = BDAB\n",
          },
          {
            input: "AGGTAB\nGXTXAYB",
            output: "LCS Length = 4\nLCS String = GTAB\n",
          },
        ],
      },
    ],
  },

  // ── Exp 6: Graph Algorithms - BFS/DFS ──────────────────────────
  {
    _id: new ObjectId("685b2a1f3c4e8d0012a7b507"),
    subjectId: new ObjectId("685b2a1f3c4e8d0012a7b002"),
    experimentNumber: 6,
    problemStatement:
      "Implementation of fundamental graph algorithms including Breadth-First Search (BFS) and Depth-First Search (DFS).",
    subExperiments: [
      {
        part: "a",
        title: "Graph Algorithms - BFS/DFS",
        concepts: ["Graph Traversal", "Breadth-First Search", "Depth-First Search"],
        hints: [
          "DFS goes as deep as possible along one path before backtracking — a natural fit for recursion.",
          "BFS explores neighbor-by-neighbor using a queue, guaranteeing the shortest path in an unweighted graph.",
          "Always mark a vertex as visited the moment it's discovered (enqueued), not when it's processed, to avoid adding it to the queue multiple times in BFS.",
        ],
        difficulty: "Medium",
        problemStatement:
          "Implement and analyze fundamental graph algorithms including Breadth-First Search (BFS) and Depth-First Search (DFS).",
        theory:
          "BFS explores a graph level by level starting from a source vertex, visiting all neighbors before moving to the next level, using a queue to track vertices to visit. DFS explores as far as possible along each branch before backtracking, using recursion (or an explicit stack). Both traversals visit every reachable vertex exactly once and are foundational for solving connectivity, shortest-path (unweighted), and cycle-detection problems. Time complexity: O(V + E) for both, where V is vertices and E is edges.",
        algorithm:
          "1. Start\n2. Read V vertices, E edges, and the edge list\n3. Read starting vertex\n4. DFS(v):\n   a. Mark v as visited; print v\n   b. For each unvisited neighbor i of v: DFS(i)\n5. BFS(start):\n   a. Mark start as visited; enqueue start\n   b. While queue is not empty:\n      Dequeue vertex v; print v\n      For each unvisited neighbor i of v: mark visited, enqueue i\n6. Stop",
        flowchart: {
          nodes: [
            { id: "1", type: "start",    label: "Start" },
            { id: "2", type: "input",    label: "Read graph (V, E, edges) and start vertex" },
            { id: "3", type: "process",  label: "DFS: visit vertex, mark visited" },
            { id: "4", type: "decision", label: "Unvisited neighbor exists?" },
            { id: "5", type: "process",  label: "Recurse DFS on neighbor" },
            { id: "6", type: "process",  label: "BFS: enqueue start, mark visited" },
            { id: "7", type: "decision", label: "Queue empty?" },
            { id: "8", type: "process",  label: "Dequeue vertex, visit, enqueue unvisited neighbors" },
            { id: "9", type: "output",   label: "Print DFS and BFS traversal orders" },
            { id: "10", type: "end",     label: "Stop" },
          ],
          edges: [
            { source: "1", target: "2" },
            { source: "2", target: "3" },
            { source: "3", target: "4" },
            { source: "4", target: "5", label: "Yes" },
            { source: "5", target: "4" },
            { source: "4", target: "6", label: "No" },
            { source: "6", target: "7" },
            { source: "7", target: "8", label: "No" },
            { source: "8", target: "7" },
            { source: "7", target: "9", label: "Yes" },
            { source: "9", target: "10" },
          ],
        },
        referenceSolution: {
          c: '#include <stdio.h>\n\n#define MAX 20\n\nint graph[MAX][MAX];\nint visited[MAX];\nint V;\n\nvoid dfs(int v) {\n    visited[v] = 1;\n    printf("%d ", v);\n    for (int i = 0; i < V; i++) {\n        if (graph[v][i] && !visited[i]) {\n            dfs(i);\n        }\n    }\n}\n\nvoid bfs(int start) {\n    int queue[MAX], front = 0, rear = 0;\n    int visitedBFS[MAX] = {0};\n\n    visitedBFS[start] = 1;\n    queue[rear++] = start;\n\n    while (front < rear) {\n        int v = queue[front++];\n        printf("%d ", v);\n        for (int i = 0; i < V; i++) {\n            if (graph[v][i] && !visitedBFS[i]) {\n                visitedBFS[i] = 1;\n                queue[rear++] = i;\n            }\n        }\n    }\n}\n\nint main() {\n    int E, u, v, start;\n\n    printf("Enter number of vertices: ");\n    scanf("%d", &V);\n    printf("Enter number of edges: ");\n    scanf("%d", &E);\n\n    for (int i = 0; i < V; i++)\n        for (int j = 0; j < V; j++)\n            graph[i][j] = 0;\n\n    printf("Enter edges (u v):\\n");\n    for (int i = 0; i < E; i++) {\n        scanf("%d %d", &u, &v);\n        graph[u][v] = 1;\n        graph[v][u] = 1;\n    }\n\n    printf("Enter starting vertex: ");\n    scanf("%d", &start);\n\n    for (int i = 0; i < V; i++) visited[i] = 0;\n    printf("DFS traversal: ");\n    dfs(start);\n    printf("\\n");\n\n    printf("BFS traversal: ");\n    bfs(start);\n    printf("\\n");\n\n    return 0;\n}',
          python: 'from collections import deque\n\ndef dfs(graph, v, visited, order):\n    visited[v] = True\n    order.append(v)\n    for i in range(len(graph)):\n        if graph[v][i] and not visited[i]:\n            dfs(graph, i, visited, order)\n\ndef bfs(graph, start):\n    V = len(graph)\n    visited = [False] * V\n    order = []\n    q = deque([start])\n    visited[start] = True\n    while q:\n        v = q.popleft()\n        order.append(v)\n        for i in range(V):\n            if graph[v][i] and not visited[i]:\n                visited[i] = True\n                q.append(i)\n    return order\n\nV = int(input("Enter number of vertices: "))\nE = int(input("Enter number of edges: "))\ngraph = [[0] * V for _ in range(V)]\n\nprint("Enter edges (u v):")\nfor _ in range(E):\n    u, v = map(int, input().split())\n    graph[u][v] = 1\n    graph[v][u] = 1\n\nstart = int(input("Enter starting vertex: "))\n\nvisited = [False] * V\ndfs_order = []\ndfs(graph, start, visited, dfs_order)\nprint("DFS traversal:", *dfs_order)\n\nbfs_order = bfs(graph, start)\nprint("BFS traversal:", *bfs_order)',
        },
        samples: [
          {
            input: "6\n7\n0 1\n0 2\n1 3\n1 4\n2 5\n3 5\n4 5\n0",
            output: "DFS traversal: 0 1 3 5 2 4 \nBFS traversal: 0 1 2 3 4 5 \n",
          },
        ],
      },
    ],
  },

  // ── Exp 7: N-Queens & Graph Coloring & sum of subsets (Backtracking) ──────────────────────────
  {
    _id: new ObjectId("685b2a1f3c4e8d0012a7b506"),
    subjectId: new ObjectId("685b2a1f3c4e8d0012a7b002"),
    experimentNumber: 7,
    problemStatement:
      "Experiment based on backtracking approach. (N-Queens problem, Graph Coloring problem, sum of subsets)",
    subExperiments: [
      {
        part: "a",
        title: "N-Queens Problem",
        concepts: ["Backtracking", "Constraint Satisfaction", "Recursion"],
        hints: [
          "Place queens one row at a time and check for conflicts before placing.",
          "A queen conflicts if another queen is in the same column, or on the same diagonal.",
          "If placing a queen leads to no solution, backtrack and try the next column.",
        ],
        difficulty: "Hard",
        problemStatement:
          "Implement and analyze the N-Queens problem using backtracking.",
        theory:
          "N-Queens places N queens on an N×N chessboard so no two queens attack each other. Backtracking tries placing a queen in each column of the current row; if valid, recurses to the next row; if no column works, it backtracks. Time: O(N!) worst case.",
        algorithm:
          "1. Start\n2. Read N\n3. solveNQ(board, row):\n   a. If row == N: print solution, return true\n   b. For col = 0 to N-1:\n      If isSafe(board, row, col):\n        Place queen at (row, col)\n        If solveNQ(board, row+1): return true\n        Remove queen (backtrack)\n4. Stop",
        flowchart: {
          nodes: [
            { id: "1", type: "start",    label: "Start" },
            { id: "2", type: "input",    label: "Read N" },
            { id: "3", type: "decision", label: "row == N?" },
            { id: "4", type: "output",   label: "Print board (solution found)" },
            { id: "5", type: "process",  label: "Try each col in current row" },
            { id: "6", type: "decision", label: "isSafe(row, col)?" },
            { id: "7", type: "process",  label: "Place queen; recurse row+1" },
            { id: "8", type: "process",  label: "Backtrack: remove queen" },
            { id: "9", type: "end",      label: "Stop" },
          ],
          edges: [
            { source: "1", target: "2" },
            { source: "2", target: "3" },
            { source: "3", target: "4", label: "Yes" },
            { source: "3", target: "5", label: "No" },
            { source: "4", target: "9" },
            { source: "5", target: "6" },
            { source: "6", target: "7", label: "Yes" },
            { source: "6", target: "8", label: "No" },
            { source: "7", target: "3" },
            { source: "8", target: "5" },
          ],
        },
        referenceSolution: {
          c: '#include <stdio.h>\n#include <stdbool.h>\n\n#define MAX 20\n\nint board[MAX][MAX];\nint N;\n\nbool isSafe(int row, int col) {\n    // Check column\n    for (int i = 0; i < row; i++)\n        if (board[i][col]) return false;\n    // Check upper-left diagonal\n    for (int i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--)\n        if (board[i][j]) return false;\n    // Check upper-right diagonal\n    for (int i = row - 1, j = col + 1; i >= 0 && j < N; i--, j++)\n        if (board[i][j]) return false;\n    return true;\n}\n\nvoid printBoard() {\n    for (int i = 0; i < N; i++) {\n        for (int j = 0; j < N; j++)\n            printf("%c ", board[i][j] ? \'Q\' : \'.\');\n        printf("\\n");\n    }\n    printf("\\n");\n}\n\nbool solveNQ(int row) {\n    if (row == N) { printBoard(); return true; }\n    bool found = false;\n    for (int col = 0; col < N; col++) {\n        if (isSafe(row, col)) {\n            board[row][col] = 1;\n            found = solveNQ(row + 1) || found;\n            board[row][col] = 0;\n        }\n    }\n    return found;\n}\n\nint main() {\n    printf("Enter N: ");\n    scanf("%d", &N);\n    for (int i = 0; i < N; i++)\n        for (int j = 0; j < N; j++)\n            board[i][j] = 0;\n    if (!solveNQ(0))\n        printf("No solution exists.\\n");\n    return 0;\n}',
          python: 'def is_safe(board, row, col, N):\n    # Check column\n    for i in range(row):\n        if board[i][col]:\n            return False\n    # Upper-left diagonal\n    i, j = row - 1, col - 1\n    while i >= 0 and j >= 0:\n        if board[i][j]: return False\n        i -= 1; j -= 1\n    # Upper-right diagonal\n    i, j = row - 1, col + 1\n    while i >= 0 and j < N:\n        if board[i][j]: return False\n        i -= 1; j += 1\n    return True\n\ndef solve_nq(board, row, N, solutions):\n    if row == N:\n        solutions.append(["".join("Q" if c else "." for c in r) for r in board])\n        return\n    for col in range(N):\n        if is_safe(board, row, col, N):\n            board[row][col] = 1\n            solve_nq(board, row + 1, N, solutions)\n            board[row][col] = 0\n\nN = int(input("Enter N: "))\nboard = [[0] * N for _ in range(N)]\nsolutions = []\nsolve_nq(board, 0, N, solutions)\nif solutions:\n    for sol in solutions:\n        for row in sol: print(row)\n        print()\nelse:\n    print("No solution exists.")',
        },
        samples: [
          {
            input: "4",
            output: ". Q . . \n. . . Q \nQ . . . \n. . Q . \n\n. . Q . \nQ . . . \n. . . Q \n. Q . . \n\n",
          },
        ],
      },

      {
        part: "b",
        title: "Graph Coloring Problem",
        concepts: ["Backtracking", "Graph Algorithms", "Constraint Satisfaction"],
        hints: [
          "Assign colors to vertices one at a time and check that no two adjacent vertices share the same color.",
          "If a color assignment is invalid, try the next color; if no color works, backtrack to the previous vertex.",
          "The minimum number of colors needed to color a graph is called its chromatic number.",
        ],
        difficulty: "Hard",
        problemStatement:
          "Implement and analyze the Graph Coloring problem using backtracking.",
        theory:
          "Graph Coloring assigns colors to graph vertices so no two adjacent vertices share a color, using at most m colors. Backtracking assigns a color to the current vertex, checks safety, and recurses. If no safe color exists it backtracks. Time: O(m^V) worst case.",
        algorithm:
          "1. Start\n2. Read graph (V vertices), m colors\n3. graphColor(vertex):\n   a. If vertex == V: print solution, return true\n   b. For c = 1 to m:\n      If isSafe(vertex, c):\n        color[vertex] = c\n        If graphColor(vertex+1): return true\n        color[vertex] = 0 (backtrack)\n4. Stop",
        flowchart: {
          nodes: [
            { id: "1", type: "start",    label: "Start" },
            { id: "2", type: "input",    label: "Read graph, m colors" },
            { id: "3", type: "decision", label: "vertex == V?" },
            { id: "4", type: "output",   label: "Print color assignment" },
            { id: "5", type: "process",  label: "Try color c (1 to m)" },
            { id: "6", type: "decision", label: "isSafe(vertex, c)?" },
            { id: "7", type: "process",  label: "Assign color; recurse vertex+1" },
            { id: "8", type: "process",  label: "Backtrack: color[vertex]=0" },
            { id: "9", type: "end",      label: "Stop" },
          ],
          edges: [
            { source: "1", target: "2" },
            { source: "2", target: "3" },
            { source: "3", target: "4", label: "Yes" },
            { source: "3", target: "5", label: "No" },
            { source: "4", target: "9" },
            { source: "5", target: "6" },
            { source: "6", target: "7", label: "Yes" },
            { source: "6", target: "8", label: "No" },
            { source: "7", target: "3" },
            { source: "8", target: "5" },
          ],
        },
        referenceSolution: {
          c: '#include <stdio.h>\n#include <stdbool.h>\n\n#define MAX 10\n\nint V, m;\nint graph[MAX][MAX];\nint color[MAX];\n\nbool isSafe(int v, int c) {\n    for (int i = 0; i < V; i++)\n        if (graph[v][i] && color[i] == c)\n            return false;\n    return true;\n}\n\nbool graphColor(int v) {\n    if (v == V) {\n        printf("Color assignment: ");\n        for (int i = 0; i < V; i++) printf("%d ", color[i]);\n        printf("\\n");\n        return true;\n    }\n    for (int c = 1; c <= m; c++) {\n        if (isSafe(v, c)) {\n            color[v] = c;\n            if (graphColor(v + 1)) return true;\n            color[v] = 0;\n        }\n    }\n    return false;\n}\n\nint main() {\n    printf("Enter number of vertices: "); scanf("%d", &V);\n    printf("Enter number of colors: ");   scanf("%d", &m);\n    printf("Enter adjacency matrix (%dx%d):\\n", V, V);\n    for (int i = 0; i < V; i++)\n        for (int j = 0; j < V; j++)\n            scanf("%d", &graph[i][j]);\n    for (int i = 0; i < V; i++) color[i] = 0;\n    if (!graphColor(0))\n        printf("No solution with %d colors.\\n", m);\n    return 0;\n}',
          python: 'def is_safe(graph, color, v, c):\n    for i in range(len(graph)):\n        if graph[v][i] and color[i] == c:\n            return False\n    return True\n\ndef graph_color(graph, color, v, m):\n    V = len(graph)\n    if v == V:\n        print("Color assignment:", *color)\n        return True\n    for c in range(1, m + 1):\n        if is_safe(graph, color, v, c):\n            color[v] = c\n            if graph_color(graph, color, v + 1, m):\n                return True\n            color[v] = 0\n    return False\n\nV = int(input("Enter number of vertices: "))\nm = int(input("Enter number of colors: "))\nprint(f"Enter adjacency matrix ({V}x{V}):")\ngraph = [list(map(int, input().split())) for _ in range(V)]\ncolor = [0] * V\nif not graph_color(graph, color, 0, m):\n    print(f"No solution with {m} colors.")',
        },
        samples: [
          {
            input: "4\n3\n0 1 1 1\n1 0 1 0\n1 1 0 1\n1 0 1 0",
            output: "Color assignment: 1 2 3 2 \n",
          },
        ],
      },
      {
        part: "c",
        title: "Sum of Subsets Problem",
        concepts: ["Backtracking", "Combinatorics", "Constraint Satisfaction"],
        hints: [
          "At each element, branch into two choices: include it in the current subset, or exclude it.",
          "Prune a branch early if the running sum already exceeds the target — no need to keep including more elements.",
          "A subset can be printed as soon as its sum equals the target; recursion can still continue to find other subsets.",
        ],
        difficulty: "Hard",
        problemStatement:
          "Implement and analyze the Sum of Subsets problem using backtracking.",
        theory:
          "Sum of Subsets finds all subsets of a given set of positive integers whose elements add up to a given target sum. Backtracking explores each element by first including it in the current subset and recursing, then excluding it and recursing, pruning any branch whose partial sum already exceeds the target. Time: O(2^n) worst case.",
        algorithm:
          "1. Start\n2. Read n elements and target sum\n3. sumOfSubsets(idx, currentSubset, sum):\n   a. If sum == target: print currentSubset, return\n   b. If sum > target or idx == n: return\n   c. Include set[idx]: sumOfSubsets(idx+1, currentSubset + set[idx], sum + set[idx])\n   d. Exclude set[idx]: sumOfSubsets(idx+1, currentSubset, sum)\n4. Stop",
        flowchart: {
          nodes: [
            { id: "1", type: "start",    label: "Start" },
            { id: "2", type: "input",    label: "Read elements, target sum" },
            { id: "3", type: "decision", label: "sum == target?" },
            { id: "4", type: "output",   label: "Print subset" },
            { id: "5", type: "decision", label: "sum > target or idx == n?" },
            { id: "6", type: "process",  label: "Include set[idx]; recurse idx+1" },
            { id: "7", type: "process",  label: "Exclude set[idx]; recurse idx+1" },
            { id: "8", type: "end",      label: "Stop" },
          ],
          edges: [
            { source: "1", target: "2" },
            { source: "2", target: "3" },
            { source: "3", target: "4", label: "Yes" },
            { source: "3", target: "5", label: "No" },
            { source: "4", target: "8" },
            { source: "5", target: "8", label: "Yes" },
            { source: "5", target: "6", label: "No" },
            { source: "6", target: "3" },
            { source: "6", target: "7" },
            { source: "7", target: "3" },
          ],
        },
        referenceSolution: {
          c: '#include <stdio.h>\n\n#define MAX 20\n\nint set[MAX];\nint subset[MAX];\nint n, target;\n\nvoid printSubset(int k) {\n    printf("{ ");\n    for (int i = 0; i < k; i++) printf("%d ", subset[i]);\n    printf("}\\n");\n}\n\nvoid sumOfSubsets(int idx, int k, int sum) {\n    if (sum == target) {\n        printSubset(k);\n        return;\n    }\n    if (sum > target || idx == n) return;\n\n    // Include set[idx]\n    subset[k] = set[idx];\n    sumOfSubsets(idx + 1, k + 1, sum + set[idx]);\n\n    // Exclude set[idx]\n    sumOfSubsets(idx + 1, k, sum);\n}\n\nint main() {\n    printf("Enter number of elements: ");\n    scanf("%d", &n);\n    printf("Enter %d elements:\\n", n);\n    for (int i = 0; i < n; i++) scanf("%d", &set[i]);\n    printf("Enter target sum: ");\n    scanf("%d", &target);\n\n    printf("Subsets with sum %d:\\n", target);\n    sumOfSubsets(0, 0, 0);\n    return 0;\n}',
          python: 'def sum_of_subsets(nums, idx, target, current, results):\n    total = sum(current)\n    if total == target:\n        results.append(list(current))\n        return\n    if total > target or idx == len(nums):\n        return\n    # include\n    current.append(nums[idx])\n    sum_of_subsets(nums, idx + 1, target, current, results)\n    current.pop()\n    # exclude\n    sum_of_subsets(nums, idx + 1, target, current, results)\n\nn = int(input("Enter number of elements: "))\nnums = list(map(int, input(f"Enter {n} elements:\\n").split()))\ntarget = int(input("Enter target sum: "))\n\nresults = []\nsum_of_subsets(nums, 0, target, [], results)\n\nprint(f"Subsets with sum {target}:")\nfor r in results:\n    print("{", *r, "}")',
        },
        samples: [
          {
            input: "5\n10 7 5 18 12\n15",
            output: "Subsets with sum 15:\n{ 10 5 }\n",
          },
        ],
      },
    ],
  },

  // ── Exp 8: 0/1 Knapsack using Branch and Bound ──────────────────────────
  {
    _id: new ObjectId("685b2a1f3c4e8d0012a7b508"),
    subjectId: new ObjectId("685b2a1f3c4e8d0012a7b002"),
    experimentNumber: 8,
    problemStatement:
      "Implement and analyze optimization problems using the branch and bound strategy.",
    subExperiments: [
      {
        part: "a",
        title: "Branch and Bound Strategy",
        concepts: ["Branch and Bound", "Optimization", "0/1 Knapsack", "Pruning"],
        hints: [
          "At each item, branch into two choices: include it, or exclude it.",
          "Compute an optimistic upper bound (via fractional knapsack) for each branch — if it can't beat the best value found so far, prune that branch entirely.",
          "Unlike plain backtracking, Branch and Bound prunes based on a computed bound, not just constraint violations, making it far more efficient for optimization problems.",
        ],
        difficulty: "Hard",
        problemStatement:
          "Implement and analyze optimization problems using the branch and bound strategy.",
        theory:
          "Branch and Bound solves optimization problems by systematically exploring the solution space (branching) while using a bound function to eliminate (prune) branches that cannot produce a better solution than the best one found so far. For the 0/1 Knapsack problem, an upper bound is estimated at each node using the fractional knapsack relaxation (allowing fractional items), which gives an optimistic value. If this bound is not better than the current best solution, the branch is discarded without exploring it further, saving significant computation compared to plain backtracking. Time: O(2^n) worst case, but with substantial pruning in practice.",
        algorithm:
          "1. Start\n2. Read n items (weight, value) and knapsack capacity\n3. branchAndBound(idx, currentWeight, currentValue):\n   a. If currentWeight > capacity: return\n   b. Update bestValue if currentValue is better\n   c. If idx == n: return\n   d. Compute bound(idx, currentWeight, currentValue) using fractional relaxation\n   e. If bound <= bestValue: prune, return\n   f. Include item idx: recurse with updated weight/value\n   g. Exclude item idx: recurse without updating weight/value\n4. Print selected items and maximum value\n5. Stop",
        flowchart: {
          nodes: [
            { id: "1", type: "start",    label: "Start" },
            { id: "2", type: "input",    label: "Read items (weight, value), capacity" },
            { id: "3", type: "decision", label: "currentWeight > capacity?" },
            { id: "4", type: "process",  label: "Update bestValue if improved" },
            { id: "5", type: "decision", label: "idx == n?" },
            { id: "6", type: "process",  label: "Compute bound via fractional relaxation" },
            { id: "7", type: "decision", label: "bound <= bestValue?" },
            { id: "8", type: "process",  label: "Include item; recurse idx+1" },
            { id: "9", type: "process",  label: "Exclude item; recurse idx+1" },
            { id: "10", type: "output",  label: "Print selected items and max value" },
            { id: "11", type: "end",     label: "Stop" },
          ],
          edges: [
            { source: "1", target: "2" },
            { source: "2", target: "3" },
            { source: "3", target: "11", label: "Yes" },
            { source: "3", target: "4",  label: "No" },
            { source: "4", target: "5" },
            { source: "5", target: "11", label: "Yes" },
            { source: "5", target: "6",  label: "No" },
            { source: "6", target: "7" },
            { source: "7", target: "11", label: "Yes (prune)" },
            { source: "7", target: "8",  label: "No" },
            { source: "8", target: "3" },
            { source: "8", target: "9" },
            { source: "9", target: "3" },
            { source: "10", target: "11" },
          ],
        },
        referenceSolution: {
          c: '#include <stdio.h>\n\n#define MAX 20\n\nint n, capacity;\nint weight[MAX], value[MAX];\nint bestValue = 0;\nint bestSelected[MAX], selected[MAX];\n\ndouble bound(int idx, int currentWeight, int currentValue) {\n    if (currentWeight >= capacity) return 0;\n    double result = currentValue;\n    int totalWeight = currentWeight;\n    int i = idx;\n    while (i < n && totalWeight + weight[i] <= capacity) {\n        totalWeight += weight[i];\n        result += value[i];\n        i++;\n    }\n    if (i < n)\n        result += (capacity - totalWeight) * ((double)value[i] / weight[i]);\n    return result;\n}\n\nvoid branchAndBound(int idx, int currentWeight, int currentValue) {\n    if (currentWeight > capacity) return;\n\n    if (currentValue > bestValue) {\n        bestValue = currentValue;\n        for (int i = 0; i < n; i++) bestSelected[i] = selected[i];\n    }\n\n    if (idx == n) return;\n\n    if (bound(idx, currentWeight, currentValue) <= bestValue) return;\n\n    selected[idx] = 1;\n    branchAndBound(idx + 1, currentWeight + weight[idx], currentValue + value[idx]);\n    selected[idx] = 0;\n\n    branchAndBound(idx + 1, currentWeight, currentValue);\n}\n\nint main() {\n    printf("Enter number of items: ");\n    scanf("%d", &n);\n    printf("Enter weight and value of each item:\\n");\n    for (int i = 0; i < n; i++)\n        scanf("%d %d", &weight[i], &value[i]);\n    printf("Enter knapsack capacity: ");\n    scanf("%d", &capacity);\n\n    for (int i = 0; i < n; i++) selected[i] = 0;\n\n    branchAndBound(0, 0, 0);\n\n    printf("\\nSelected items: ");\n    for (int i = 0; i < n; i++)\n        if (bestSelected[i]) printf("%d ", i + 1);\n    printf("\\nMaximum value = %d\\n", bestValue);\n\n    return 0;\n}',
          python: 'def bound(idx, current_weight, current_value, n, capacity, weight, value):\n    if current_weight >= capacity:\n        return 0\n    result = current_value\n    total_weight = current_weight\n    i = idx\n    while i < n and total_weight + weight[i] <= capacity:\n        total_weight += weight[i]\n        result += value[i]\n        i += 1\n    if i < n:\n        result += (capacity - total_weight) * (value[i] / weight[i])\n    return result\n\ndef branch_and_bound(idx, current_weight, current_value, n, capacity, weight, value, selected, best):\n    if current_weight > capacity:\n        return\n    if current_value > best["value"]:\n        best["value"] = current_value\n        best["selected"] = selected.copy()\n    if idx == n:\n        return\n    if bound(idx, current_weight, current_value, n, capacity, weight, value) <= best["value"]:\n        return\n\n    selected[idx] = 1\n    branch_and_bound(idx + 1, current_weight + weight[idx], current_value + value[idx],\n                      n, capacity, weight, value, selected, best)\n    selected[idx] = 0\n\n    branch_and_bound(idx + 1, current_weight, current_value,\n                      n, capacity, weight, value, selected, best)\n\nn = int(input("Enter number of items: "))\nweight = [0] * n\nvalue = [0] * n\nprint("Enter weight and value of each item:")\nfor i in range(n):\n    w, v = map(int, input().split())\n    weight[i] = w\n    value[i] = v\ncapacity = int(input("Enter knapsack capacity: "))\n\nselected = [0] * n\nbest = {"value": 0, "selected": [0] * n}\nbranch_and_bound(0, 0, 0, n, capacity, weight, value, selected, best)\n\nprint("\\nSelected items:", *[i + 1 for i in range(n) if best["selected"][i]])\nprint("Maximum value =", best["value"])',
        },
        samples: [
          {
            input: "4\n2 40\n3 50\n4 60\n5 70\n5",
            output: "\nSelected items: 1 2 \nMaximum value = 90\n",
          },
        ],
      },
    ],
  },

  // ── Exp 9: String Matching ────────────────────────────────────────────────────
  {
    _id: new ObjectId("685b2a1f3c4e8d0012a7b507"),
    subjectId: new ObjectId("685b2a1f3c4e8d0012a7b002"),
    experimentNumber: 9,
    problemStatement:
      "Experiment based on string matching algorithms. (Naive, KMP, Rabin-Karp)",
    subExperiments: [
      {
        part: "a",
        title: "Naive String Matching",
        concepts: ["String Algorithms", "Pattern Matching", "Brute Force"],
        hints: [
          "Slide the pattern over the text one position at a time.",
          "At each position, check if the pattern matches the substring of the text starting at that position.",
          "Time complexity is O((n-m+1) × m) where n is text length and m is pattern length.",
        ],
        difficulty: "Easy",
        problemStatement:
          "Implement and analyze the Naive String Matching algorithm.",
        theory:
          "Naive string matching slides the pattern P over text T one character at a time and checks for a match at every position. Time: O((n-m+1)×m) worst case. Simple but inefficient for large inputs with repetitive characters.",
        algorithm:
          "1. Start\n2. Read text T (length n) and pattern P (length m)\n3. For i = 0 to n-m:\n   For j = 0 to m-1: if T[i+j] != P[j]: break\n   If j == m: print match at index i\n4. Stop",
        flowchart: {
          nodes: [
            { id: "1", type: "start",    label: "Start" },
            { id: "2", type: "input",    label: "Read text T, pattern P" },
            { id: "3", type: "process",  label: "i = 0" },
            { id: "4", type: "decision", label: "i <= n-m?" },
            { id: "5", type: "process",  label: "Compare P with T[i..i+m-1]" },
            { id: "6", type: "decision", label: "Full match?" },
            { id: "7", type: "output",   label: "Print match at index i" },
            { id: "8", type: "process",  label: "i++" },
            { id: "9", type: "end",      label: "Stop" },
          ],
          edges: [
            { source: "1", target: "2" },
            { source: "2", target: "3" },
            { source: "3", target: "4" },
            { source: "4", target: "5", label: "Yes" },
            { source: "4", target: "9", label: "No" },
            { source: "5", target: "6" },
            { source: "6", target: "7", label: "Yes" },
            { source: "6", target: "8", label: "No" },
            { source: "7", target: "8" },
            { source: "8", target: "4" },
          ],
        },
        referenceSolution: {
          c: '#include <stdio.h>\n#include <string.h>\n\nvoid naiveSearch(char T[], char P[]) {\n    int n = strlen(T);\n    int m = strlen(P);\n    int found = 0;\n    for (int i = 0; i <= n - m; i++) {\n        int j;\n        for (j = 0; j < m; j++)\n            if (T[i + j] != P[j]) break;\n        if (j == m) {\n            printf("Pattern found at index %d\\n", i);\n            found = 1;\n        }\n    }\n    if (!found) printf("Pattern not found\\n");\n}\n\nint main() {\n    char T[1000], P[100];\n    printf("Enter text:    "); scanf("%s", T);\n    printf("Enter pattern: "); scanf("%s", P);\n    naiveSearch(T, P);\n    return 0;\n}',
          python: 'def naive_search(text, pattern):\n    n, m = len(text), len(pattern)\n    found = False\n    for i in range(n - m + 1):\n        if text[i:i + m] == pattern:\n            print(f"Pattern found at index {i}")\n            found = True\n    if not found:\n        print("Pattern not found")\n\ntext    = input("Enter text:    ")\npattern = input("Enter pattern: ")\nnaive_search(text, pattern)',
        },
        samples: [
          {
            input: "AABAACAADAABAABA\nAABA",
            output: "Pattern found at index 0\nPattern found at index 9\nPattern found at index 12\n",
          },
          {
            input: "ABCDEFGH\nXYZ",
            output: "Pattern not found\n",
          },
        ],
      },

      {
        part: "b",
        title: "KMP String Matching",
        concepts: ["String Algorithms", "Pattern Matching", "Failure Function"],
        hints: [
          "Precompute the LPS (Longest Proper Prefix which is also Suffix) array for the pattern.",
          "Use the LPS array to skip unnecessary comparisons when a mismatch occurs.",
          "The KMP algorithm never re-examines characters of the text that have already been matched.",
        ],
        difficulty: "Medium",
        problemStatement:
          "Implement and analyze the Knuth-Morris-Pratt (KMP) string matching algorithm.",
        theory:
          "KMP preprocesses the pattern into an LPS (failure function) array that encodes the longest proper prefix-suffix at each position. On a mismatch, instead of restarting, it uses the LPS array to skip ahead. Time: O(n+m); Space: O(m). Much better than naive for repetitive patterns.",
        algorithm:
          "1. Start\n2. Read text T (length n) and pattern P (length m)\n3. Compute LPS[] array for P\n4. i=0, j=0\n5. While i < n:\n   a. If P[j]==T[i]: i++, j++\n   b. If j==m: print match at i-j; j=LPS[j-1]\n   c. Else if i<n and P[j]!=T[i]: if j>0 j=LPS[j-1]; else i++\n6. Stop",
        flowchart: {
          nodes: [
            { id: "1", type: "start",    label: "Start" },
            { id: "2", type: "input",    label: "Read text T, pattern P" },
            { id: "3", type: "process",  label: "Compute LPS[] for P" },
            { id: "4", type: "process",  label: "i=0, j=0" },
            { id: "5", type: "decision", label: "i < n?" },
            { id: "6", type: "decision", label: "T[i] == P[j]?" },
            { id: "7", type: "process",  label: "i++, j++" },
            { id: "8", type: "decision", label: "j == m?" },
            { id: "9", type: "output",   label: "Match at index i-j; j=LPS[j-1]" },
            { id: "10", type: "process", label: "Use LPS to adjust j or advance i" },
            { id: "11", type: "end",     label: "Stop" },
          ],
          edges: [
            { source: "1",  target: "2" },
            { source: "2",  target: "3" },
            { source: "3",  target: "4" },
            { source: "4",  target: "5" },
            { source: "5",  target: "6",  label: "Yes" },
            { source: "5",  target: "11", label: "No" },
            { source: "6",  target: "7",  label: "Yes" },
            { source: "6",  target: "10", label: "No" },
            { source: "7",  target: "8" },
            { source: "8",  target: "9",  label: "Yes" },
            { source: "8",  target: "5",  label: "No" },
            { source: "9",  target: "5" },
            { source: "10", target: "5" },
          ],
        },
        referenceSolution: {
          c: '#include <stdio.h>\n#include <string.h>\n#include <stdlib.h>\n\nvoid computeLPS(char P[], int m, int lps[]) {\n    int len = 0, i = 1;\n    lps[0] = 0;\n    while (i < m) {\n        if (P[i] == P[len]) { lps[i++] = ++len; }\n        else if (len) { len = lps[len - 1]; }\n        else { lps[i++] = 0; }\n    }\n}\n\nvoid KMPSearch(char T[], char P[]) {\n    int n = strlen(T), m = strlen(P);\n    int *lps = (int *)malloc(m * sizeof(int));\n    computeLPS(P, m, lps);\n    int i = 0, j = 0, found = 0;\n    while (i < n) {\n        if (P[j] == T[i]) { i++; j++; }\n        if (j == m) {\n            printf("Pattern found at index %d\\n", i - j);\n            found = 1;\n            j = lps[j - 1];\n        } else if (i < n && P[j] != T[i]) {\n            if (j) j = lps[j - 1];\n            else   i++;\n        }\n    }\n    if (!found) printf("Pattern not found\\n");\n    free(lps);\n}\n\nint main() {\n    char T[1000], P[100];\n    printf("Enter text:    "); scanf("%s", T);\n    printf("Enter pattern: "); scanf("%s", P);\n    KMPSearch(T, P);\n    return 0;\n}',
          python: 'def compute_lps(pattern):\n    m = len(pattern)\n    lps = [0] * m\n    length, i = 0, 1\n    while i < m:\n        if pattern[i] == pattern[length]:\n            length += 1\n            lps[i] = length\n            i += 1\n        elif length:\n            length = lps[length - 1]\n        else:\n            lps[i] = 0\n            i += 1\n    return lps\n\ndef kmp_search(text, pattern):\n    n, m = len(text), len(pattern)\n    lps = compute_lps(pattern)\n    i = j = 0\n    found = False\n    while i < n:\n        if pattern[j] == text[i]:\n            i += 1; j += 1\n        if j == m:\n            print(f"Pattern found at index {i - j}")\n            found = True\n            j = lps[j - 1]\n        elif i < n and pattern[j] != text[i]:\n            if j: j = lps[j - 1]\n            else: i += 1\n    if not found:\n        print("Pattern not found")\n\ntext    = input("Enter text:    ")\npattern = input("Enter pattern: ")\nkmp_search(text, pattern)',
        },
        samples: [
          {
            input: "AAACAAAB\nAAAB",
            output: "Pattern found at index 4\n",
          },
          {
            input: "AABABABABC\nABAB",
            output: "Pattern found at index 1\nPattern found at index 3\nPattern found at index 5\n",
          },
        ],
      },

      {
        part: "c",
        title: "Rabin-Karp String Matching",
        concepts: ["String Algorithms", "Pattern Matching", "Hashing"],
        hints: [
          "Compute a rolling hash of the pattern and each window of the text.",
          "When hashes match, verify by character-by-character comparison (to handle spurious hits).",
          "Use modular arithmetic to prevent hash values from becoming too large.",
        ],
        difficulty: "Medium",
        problemStatement:
          "Implement and analyze the Rabin-Karp string matching algorithm.",
        theory:
          "Rabin-Karp uses rolling hashing to compare pattern hash with each text window hash in O(1). Hash mismatch means no match; hash match triggers character verification. Average Time: O(n+m); Worst: O(nm) with many spurious hits. Space: O(1).",
        algorithm:
          "1. Start\n2. Read text T (length n), pattern P (length m)\n3. Compute hash(P) and hash(T[0..m-1])\n4. For i=0 to n-m:\n   a. If hP==hT: verify character by character\n   b. If match: print index i\n   c. Compute rolling hash for next window\n5. Stop",
        flowchart: {
          nodes: [
            { id: "1", type: "start",    label: "Start" },
            { id: "2", type: "input",    label: "Read text T, pattern P" },
            { id: "3", type: "process",  label: "Compute hash(P) and hash(T[0..m-1])" },
            { id: "4", type: "process",  label: "i = 0" },
            { id: "5", type: "decision", label: "i <= n-m?" },
            { id: "6", type: "decision", label: "hP == hT?" },
            { id: "7", type: "decision", label: "Exact match T[i..i+m-1]==P?" },
            { id: "8", type: "output",   label: "Print match at index i" },
            { id: "9", type: "process",  label: "Compute rolling hash; i++" },
            { id: "10", type: "end",     label: "Stop" },
          ],
          edges: [
            { source: "1",  target: "2" },
            { source: "2",  target: "3" },
            { source: "3",  target: "4" },
            { source: "4",  target: "5" },
            { source: "5",  target: "6",  label: "Yes" },
            { source: "5",  target: "10", label: "No" },
            { source: "6",  target: "7",  label: "Yes" },
            { source: "6",  target: "9",  label: "No" },
            { source: "7",  target: "8",  label: "Yes" },
            { source: "7",  target: "9",  label: "No" },
            { source: "8",  target: "9" },
            { source: "9",  target: "5" },
          ],
        },
        referenceSolution: {
          c: '#include <stdio.h>\n#include <string.h>\n\n#define D 256\n#define Q 101\n\nvoid rabinKarp(char T[], char P[]) {\n    int n = strlen(T), m = strlen(P);\n    int hP = 0, hT = 0, h = 1, found = 0;\n    for (int i = 0; i < m - 1; i++) h = (h * D) % Q;\n    for (int i = 0; i < m; i++) {\n        hP = (D * hP + P[i]) % Q;\n        hT = (D * hT + T[i]) % Q;\n    }\n    for (int i = 0; i <= n - m; i++) {\n        if (hP == hT) {\n            int j;\n            for (j = 0; j < m; j++)\n                if (T[i + j] != P[j]) break;\n            if (j == m) {\n                printf("Pattern found at index %d\\n", i);\n                found = 1;\n            }\n        }\n        if (i < n - m)\n            hT = (D * (hT - T[i] * h) + T[i + m]) % Q;\n        if (hT < 0) hT += Q;\n    }\n    if (!found) printf("Pattern not found\\n");\n}\n\nint main() {\n    char T[1000], P[100];\n    printf("Enter text:    ");\n    fgets(T, sizeof(T), stdin);\n    T[strcspn(T, "\\n")] = \'\\0\';\n\n    printf("Enter pattern: ");\n    fgets(P, sizeof(P), stdin);\n    P[strcspn(P, "\\n")] = \'\\0\';\n\n    rabinKarp(T, P);\n    return 0;\n}',
          python: 'D = 256\nQ = 101\n\ndef rabin_karp(text, pattern):\n    n, m = len(text), len(pattern)\n    h = pow(D, m - 1, Q)\n    hp = hT = 0\n    for i in range(m):\n        hp = (D * hp + ord(pattern[i])) % Q\n        hT = (D * hT + ord(text[i]))    % Q\n    found = False\n    for i in range(n - m + 1):\n        if hp == hT:\n            if text[i:i + m] == pattern:\n                print(f"Pattern found at index {i}")\n                found = True\n        if i < n - m:\n            hT = (D * (hT - ord(text[i]) * h) + ord(text[i + m])) % Q\n            if hT < 0:\n                hT += Q\n    if not found:\n        print("Pattern not found")\n\ntext    = input("Enter text:    ")\npattern = input("Enter pattern: ")\nrabin_karp(text, pattern)',
        },
        samples: [
          {
            input: "GEEKS FOR GEEKS\nGEEK",
            output: "Pattern found at index 0\nPattern found at index 10\n",
          },
          {
            input: "AABAACAADAABAABA\nAABA",
            output: "Pattern found at index 0\nPattern found at index 9\nPattern found at index 12\n",
          },
        ],
      },
    ],
  },

  // ── Exp 10: Min-Max Algorithm ─────────────────────────────────────────────────
  {
    _id: new ObjectId("685b2a1f3c4e8d0012a7b50a"),
    subjectId: new ObjectId("685b2a1f3c4e8d0012a7b002"),
    experimentNumber: 10,
    problemStatement: "Implementation of Min-Max Algorithm",
    subExperiments: [
      {
        part: "a",
        title: "Min-Max Algorithm",
        concepts: ["Game Theory", "Adversarial Search", "Decision Trees"],
        hints: [
          "Recursively evaluate the game tree: Maximizer tries to maximize score, Minimizer tries to minimize it.",
          "At leaf nodes, return the heuristic evaluation value of the board state.",
          "Implement Alpha-Beta pruning to discard branches that cannot influence the final decision, reducing the search space.",
        ],
        difficulty: "Medium",
        problemStatement: "Implement and analyze the Min-Max algorithm.",
        theory:
          "Min-Max is used in two-player zero-sum game trees. The Maximizer picks the highest-scoring move; the Minimizer picks the lowest. The algorithm recursively evaluates all possible moves. Time: O(b^d). Alpha-Beta pruning reduces this to O(b^(d/2)) by eliminating irrelevant branches.",
        algorithm:
          "1. If depth==0 or leaf: return heuristic score\n2. If Maximizer's turn:\n   best=-INF; for each child: best=max(best, minimax(child,depth-1,false)); return best\n3. If Minimizer's turn:\n   best=+INF; for each child: best=min(best, minimax(child,depth-1,true)); return best",
        flowchart: {
          nodes: [
            { id: "1", type: "start",    label: "Start" },
            { id: "2", type: "input",    label: "Read game tree scores, depth" },
            { id: "3", type: "decision", label: "Leaf or depth==0?" },
            { id: "4", type: "output",   label: "Return leaf score" },
            { id: "5", type: "decision", label: "Maximizer's turn?" },
            { id: "6", type: "process",  label: "Return max of children" },
            { id: "7", type: "process",  label: "Return min of children" },
            { id: "8", type: "output",   label: "Print optimal value" },
            { id: "9", type: "end",      label: "Stop" },
          ],
          edges: [
            { source: "1", target: "2" },
            { source: "2", target: "3" },
            { source: "3", target: "4", label: "Yes" },
            { source: "3", target: "5", label: "No" },
            { source: "4", target: "8" },
            { source: "5", target: "6", label: "Yes" },
            { source: "5", target: "7", label: "No" },
            { source: "6", target: "8" },
            { source: "7", target: "8" },
            { source: "8", target: "9" },
          ],
        },
        referenceSolution: {
          c: '#include <stdio.h>\n#include <limits.h>\n\n// Leaf scores for the game tree (depth = 3, branching factor = 2 => 8 leaves)\nint leaves[] = {3, 5, 2, 9, 12, 5, 23, 23};\nint leafCount = 0;\n\n// isMaximizing: 1 for Maximizer, 0 for Minimizer\nint minimax(int depth, int isMaximizing) {\n    // Leaf node: return the score\n    if (depth == 0)\n        return leaves[leafCount++];\n\n    if (isMaximizing) {\n        int best = INT_MIN;\n        // Evaluate left and right subtrees\n        int left  = minimax(depth - 1, 0);\n        int right = minimax(depth - 1, 0);\n        best = (left > right) ? left : right;\n        return best;\n    } else {\n        int best = INT_MAX;\n        int left  = minimax(depth - 1, 1);\n        int right = minimax(depth - 1, 1);\n        best = (left < right) ? left : right;\n        return best;\n    }\n}\n\nint main() {\n    // Game tree with depth 3 and branching factor 2\n    // Leaves (left to right): 3, 5, 2, 9, 12, 5, 23, 23\n    int optimal = minimax(3, 1);  // Start: Maximizer\'s turn\n    printf("Optimal value: %d\\n", optimal);\n    return 0;\n}',
          python: 'import math\n\n# Leaf scores for the game tree (depth=3, branching factor=2 => 8 leaves)\nleaves = [3, 5, 2, 9, 12, 5, 23, 23]\nleaf_index = 0\n\ndef minimax(depth, is_maximizing):\n    global leaf_index\n    # Base case: leaf node\n    if depth == 0:\n        val = leaves[leaf_index]\n        leaf_index += 1\n        return val\n\n    if is_maximizing:\n        left  = minimax(depth - 1, False)\n        right = minimax(depth - 1, False)\n        return max(left, right)\n    else:\n        left  = minimax(depth - 1, True)\n        right = minimax(depth - 1, True)\n        return min(left, right)\n\n# Game tree: depth=3, Maximizer starts\noptimal = minimax(3, True)\nprint(f"Optimal value: {optimal}")',
        },
        samples: [
          {
            input: "",
            output: "Optimal value: 12\n",
          },
        ],
      },
    ],
  },

  // ── Exp 11: Job Sequencing with Deadlines ─────────────────────────────────────
  {
    _id: new ObjectId("685b2a1f3c4e8d0012a7b50b"),
    subjectId: new ObjectId("685b2a1f3c4e8d0012a7b002"),
    experimentNumber: 11,
    problemStatement: "Implementation of Job Sequencing with deadlines.",
    subExperiments: [
      {
        part: "a",
        title: "Job Sequencing with Deadlines",
        concepts: [
          "Greedy Method",
          "Job Scheduling",
          "Optimization Algorithms",
        ],
        hints: [
          "Sort all jobs in descending order of their profits.",
          "For each job, find the latest available time slot that is less than or equal to its deadline.",
          "If a slot is found, allocate it to the job and add the job's profit to the total profit.",
        ],
        difficulty: "Hard",
        problemStatement:
          "Implement and analyze the Job Sequencing with Deadlines problem.",
        theory:
          "Greedy approach: sort jobs by profit descending. For each job, assign it to the latest available slot at or before its deadline. Maximizes total profit. Time: O(n²). Applications: CPU scheduling, project management.",
        algorithm:
          "1. Start\n2. Read n jobs (id, deadline, profit)\n3. Sort by profit descending\n4. slot[]={0} for all slots up to max deadline\n5. For each job: find latest free slot <= deadline; assign if found\n6. Print scheduled jobs and total profit\n7. Stop",
        flowchart: {
          nodes: [
            { id: "1", type: "start",    label: "Start" },
            { id: "2", type: "input",    label: "Read jobs (id, deadline, profit)" },
            { id: "3", type: "process",  label: "Sort by profit descending" },
            { id: "4", type: "decision", label: "Jobs remaining?" },
            { id: "5", type: "decision", label: "Free slot <= deadline?" },
            { id: "6", type: "process",  label: "Assign to slot; add profit" },
            { id: "7", type: "output",   label: "Print schedule and total profit" },
            { id: "8", type: "end",      label: "Stop" },
          ],
          edges: [
            { source: "1", target: "2" },
            { source: "2", target: "3" },
            { source: "3", target: "4" },
            { source: "4", target: "7", label: "No" },
            { source: "4", target: "5", label: "Yes" },
            { source: "5", target: "6", label: "Yes" },
            { source: "5", target: "4", label: "No (skip)" },
            { source: "6", target: "4" },
            { source: "7", target: "8" },
          ],
        },
        referenceSolution: {
          c: '#include <stdio.h>\n\n#define MAX 100\n\nstruct Job {\n    int id;\n    int deadline;\n    int profit;\n};\n\nvoid sortJobs(struct Job jobs[], int n) {\n    struct Job temp;\n    for (int i = 0; i < n - 1; i++)\n        for (int j = i + 1; j < n; j++)\n            if (jobs[i].profit < jobs[j].profit) {\n                temp = jobs[i]; jobs[i] = jobs[j]; jobs[j] = temp;\n            }\n}\n\nint main() {\n    int n;\n    printf("Enter number of jobs: ");\n    scanf("%d", &n);\n\n    struct Job jobs[MAX];\n    printf("Enter job id, deadline, profit:\\n");\n    for (int i = 0; i < n; i++)\n        scanf("%d %d %d", &jobs[i].id, &jobs[i].deadline, &jobs[i].profit);\n\n    sortJobs(jobs, n);\n\n    int maxDeadline = 0;\n    for (int i = 0; i < n; i++)\n        if (jobs[i].deadline > maxDeadline)\n            maxDeadline = jobs[i].deadline;\n\n    int slot[MAX] = {0};\n    int totalProfit = 0;\n\n    printf("\\nSelected Jobs:\\n");\n    for (int i = 0; i < n; i++) {\n        for (int j = jobs[i].deadline; j > 0; j--) {\n            if (slot[j] == 0) {\n                slot[j] = jobs[i].id;\n                totalProfit += jobs[i].profit;\n                printf("Job %d scheduled at slot %d\\n", jobs[i].id, j);\n                break;\n            }\n        }\n    }\n\n    printf("\\nTotal Profit = %d\\n", totalProfit);\n    return 0;\n}',
          python: 'def job_sequencing(jobs):\n    # jobs: list of (id, deadline, profit)\n    jobs.sort(key=lambda x: x[2], reverse=True)  # sort by profit desc\n    max_deadline = max(d for _, d, _ in jobs)\n    slot = [0] * (max_deadline + 1)   # slot[t] = job_id assigned to time t\n    total_profit = 0\n\n    print("\\nSelected Jobs:")\n    for job_id, deadline, profit in jobs:\n        for t in range(deadline, 0, -1):\n            if slot[t] == 0:\n                slot[t] = job_id\n                total_profit += profit\n                print(f"Job {job_id} scheduled at slot {t}")\n                break\n\n    print(f"\\nTotal Profit = {total_profit}")\n\nn = int(input("Enter number of jobs: "))\nprint("Enter job id, deadline, profit:")\njobs = []\nfor _ in range(n):\n    jid, d, p = map(int, input().split())\n    jobs.append((jid, d, p))\njob_sequencing(jobs)',
        },
        samples: [
          {
            input: "5\n1 2 100\n2 1 19\n3 2 27\n4 1 25\n5 3 15",
            output: "Selected Jobs:\nJob 1 scheduled at slot 2\nJob 3 scheduled at slot 1\nJob 5 scheduled at slot 3\n\nTotal Profit = 142\n",
          },
        ],
      },
    ],
  },

  // ── Exp 12: Bellman-Ford Algorithm ───────────────────────────────────────────
  {
    _id: new ObjectId("685b2a1f3c4e8d0012a7b50c"),
    subjectId: new ObjectId("685b2a1f3c4e8d0012a7b002"),
    experimentNumber: 12,
    problemStatement:
      "Implementation of Bellman Ford Algorithm using Dynamic programming",
    subExperiments: [
      {
        part: "a",
        title: "Bellman-Ford Algorithm",
        concepts: [
          "Dynamic Programming",
          "Graph Algorithms",
          "Negative Cycle Detection",
        ],
        hints: [
          "Relax all edges in the graph exactly V-1 times, where V is the number of vertices.",
          "To detect negative weight cycles, run a V-th relaxation step; if any distance decreases, a negative cycle exists.",
          "Unlike Dijkstra's algorithm, Bellman-Ford can handle negative weight edges.",
        ],
        difficulty: "Hard",
        problemStatement:
          "Implement and analyze the Bellman-Ford Algorithm using dynamic programming.",
        theory:
          "Bellman-Ford finds shortest paths from a source in weighted directed graphs including those with negative edges (unlike Dijkstra's). Relaxes all E edges V-1 times. A V-th pass detects negative cycles. Time: O(V×E); Space: O(V). Used in RIP routing protocol.",
        algorithm:
          "1. Start\n2. Read V, E, source src\n3. dist[]=INF, dist[src]=0\n4. Repeat V-1 times:\n   For each edge (u,v,w): if dist[u]+w < dist[v], update dist[v]\n5. Check for negative cycles: if any edge still relaxes, report\n6. Print dist[]\n7. Stop",
        flowchart: {
          nodes: [
            { id: "1", type: "start",    label: "Start" },
            { id: "2", type: "input",    label: "Read graph, src" },
            { id: "3", type: "process",  label: "dist[]=INF, dist[src]=0" },
            { id: "4", type: "process",  label: "Relax all E edges, repeat V-1 times" },
            { id: "5", type: "decision", label: "Negative cycle?" },
            { id: "6", type: "output",   label: "Print 'Negative cycle detected'" },
            { id: "7", type: "output",   label: "Print shortest distances" },
            { id: "8", type: "end",      label: "Stop" },
          ],
          edges: [
            { source: "1", target: "2" },
            { source: "2", target: "3" },
            { source: "3", target: "4" },
            { source: "4", target: "5" },
            { source: "5", target: "6", label: "Yes" },
            { source: "5", target: "7", label: "No" },
            { source: "6", target: "8" },
            { source: "7", target: "8" },
          ],
        },
        referenceSolution: {
          c: '#include <stdio.h>\n\n#define INF 99999\n\nstruct Edge {\n    int src, dest, weight;\n};\n\nvoid bellmanFord(struct Edge edges[], int V, int E, int src) {\n    int dist[V];\n    for (int i = 0; i < V; i++) dist[i] = INF;\n    dist[src] = 0;\n\n    // Relax all edges V-1 times\n    for (int i = 1; i <= V - 1; i++) {\n        for (int j = 0; j < E; j++) {\n            int u = edges[j].src;\n            int v = edges[j].dest;\n            int w = edges[j].weight;\n            if (dist[u] != INF && dist[u] + w < dist[v])\n                dist[v] = dist[u] + w;\n        }\n    }\n\n    // Check for negative weight cycle\n    for (int j = 0; j < E; j++) {\n        int u = edges[j].src;\n        int v = edges[j].dest;\n        int w = edges[j].weight;\n        if (dist[u] != INF && dist[u] + w < dist[v]) {\n            printf("Graph contains negative weight cycle\\n");\n            return;\n        }\n    }\n\n    printf("Vertex\\tDistance\\n");\n    for (int i = 0; i < V; i++)\n        printf("%d\\t%d\\n", i, dist[i]);\n}\n\nint main() {\n    int V, E, src;\n    printf("Enter number of vertices, edges, source: ");\n    scanf("%d %d %d", &V, &E, &src);\n\n    struct Edge edges[E];\n    printf("Enter edges (src dest weight):\\n");\n    for (int i = 0; i < E; i++)\n        scanf("%d %d %d", &edges[i].src, &edges[i].dest, &edges[i].weight);\n\n    bellmanFord(edges, V, E, src);\n    return 0;\n}',
          python: 'INF = float("inf")\n\ndef bellman_ford(V, edges, src):\n    dist = [INF] * V\n    dist[src] = 0\n\n    # Relax all edges V-1 times\n    for _ in range(V - 1):\n        for u, v, w in edges:\n            if dist[u] != INF and dist[u] + w < dist[v]:\n                dist[v] = dist[u] + w\n\n    # Detect negative weight cycle\n    for u, v, w in edges:\n        if dist[u] != INF and dist[u] + w < dist[v]:\n            print("Graph contains negative weight cycle")\n            return\n\n    print("Vertex\\tDistance")\n    for i in range(V):\n        print(f"{i}\\t{dist[i]}")\n\nV, E, src = map(int, input("Enter number of vertices, edges, source: ").split())\nprint("Enter edges (src dest weight):")\nedges = [tuple(map(int, input().split())) for _ in range(E)]\nbellman_ford(V, edges, src)',
        },
        samples: [
          {
            input: "5 8 0\n0 1 -1\n0 2 4\n1 2 3\n1 3 2\n1 4 2\n3 2 5\n3 1 1\n4 3 -3",
            output: "Vertex\tDistance\n0\t0\n1\t-1\n2\t2\n3\t-2\n4\t1\n",
          },
        ],
      },
    ],
  },
];

// ─── Seed Function ────────────────────────────────────────────────────────────
async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(" Connected to MongoDB");

    // Upsert subjects
    for (const subject of subjects) {
      await Subject.findByIdAndUpdate(subject._id, subject, {
        upsert: true,
        new: true,
        runValidators: true,
      });
      console.log(`Upserted subject: ${subject.name}`);
    }

    // Upsert experiments
    for (const experiment of experiments) {
      await Experiment.findByIdAndUpdate(experiment._id, experiment, {
        upsert: true,
        new: true,
        runValidators: true,
      });
      console.log(
        `🔬 Upserted experiment #${experiment.experimentNumber}: ${experiment.problemStatement.slice(0, 60)}...`
      );
    }

    console.log("\n AoA seed complete!");
  } catch (err) {
    console.error("Seed failed:", err);
  } finally {
    await mongoose.disconnect();
    console.log(" Disconnected from MongoDB");
  }
}

seed();
