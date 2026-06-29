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
      "Experiment based on common mathematical functions.( Selection sort, Insertion sort)",
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
        problemStatement: "Implement and analyze the Selection Sort algorithm.",
        theory:
          "Selection Sort divides the array into sorted and unsorted regions. Each pass finds the minimum element in the unsorted region and swaps it into the correct position. Time complexity: O(n²) in all cases; Space: O(1). It performs at most n-1 swaps, making it useful when memory writes are costly.",
        algorithm:
          "1. Start\n2. Read array arr[] of n elements\n3. For i = 0 to n-2:\n   a. min_idx = i\n   b. For j = i+1 to n-1: if arr[j] < arr[min_idx], set min_idx = j\n   c. Swap arr[i] and arr[min_idx]\n4. Print sorted array\n5. Stop",
        flowchart: {
          nodes: [
            { id: "1", type: "start", label: "Start" },
            { id: "2", type: "input", label: "Read arr[], n" },
            { id: "3", type: "process", label: "i = 0" },
            { id: "4", type: "decision", label: "i < n-1?" },
            {
              id: "5",
              type: "process",
              label: "Find min in arr[i..n-1]; swap with arr[i]; i++",
            },
            { id: "6", type: "output", label: "Print sorted array" },
            { id: "7", type: "end", label: "Stop" },
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
          c: '#include <stdio.h>\n\nvoid selectionSort(int arr[], int n) {\n    int i, j, minIndex, temp;\n\n    for (i = 0; i < n - 1; i++) {\n        minIndex = i;\n\n        for (j = i + 1; j < n; j++) {\n            if (arr[j] < arr[minIndex]) {\n                minIndex = j;\n            }\n        }\n\n        temp = arr[i];\n        arr[i] = arr[minIndex];\n        arr[minIndex] = temp;\n    }\n}\n\nvoid printArray(int arr[], int n) {\n    int i;\n    for (i = 0; i < n; i++) {\n        printf("%d ", arr[i]);\n    }\n    printf("\\n");\n}\n\nint main() {\n    int n, i;\n\n    printf("Enter the number of elements: ");\n    scanf("%d", &n);\n\n    int arr[n];\n\n    printf("Enter %d elements:\\n", n);\n    for (i = 0; i < n; i++) {\n        scanf("%d", &arr[i]);\n    }\n\n    printf("Original array: ");\n    printArray(arr, n);\n\n    selectionSort(arr, n);\n\n    printf("Sorted array: ");\n    printArray(arr, n);\n\n    return 0;\n}',
        },
        samples: [{ input: "5\n64 25 12 22 11", output: "11 12 22 25 64 \n" }],
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
        problemStatement: "Implement and analyze the Insertion Sort algorithm.",
        theory:
          "Insertion Sort builds a sorted subarray one element at a time by picking each element and inserting it into its correct position. Time: O(n²) worst/average, O(n) best (already sorted); Space: O(1). Stable and in-place; efficient for small or nearly-sorted datasets.",
        algorithm:
          "1. Start\n2. Read array arr[] of n elements\n3. For i = 1 to n-1:\n   a. key = arr[i], j = i-1\n   b. While j >= 0 and arr[j] > key: arr[j+1] = arr[j], j--\n   c. arr[j+1] = key\n4. Print sorted array\n5. Stop",
        flowchart: {
          nodes: [
            { id: "1", type: "start", label: "Start" },
            { id: "2", type: "input", label: "Read arr[], n" },
            { id: "3", type: "process", label: "i = 1" },
            { id: "4", type: "decision", label: "i < n?" },
            {
              id: "5",
              type: "process",
              label:
                "key=arr[i]; shift larger elements right; arr[j+1]=key; i++",
            },
            { id: "6", type: "output", label: "Print sorted array" },
            { id: "7", type: "end", label: "Stop" },
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
          c: '#include <stdio.h>\n\nvoid insertionSort(int arr[], int n) {\n    int i, key, j;\n\n    for (i = 1; i < n; i++) {\n        key = arr[i];\n        j = i - 1;\n\n        while (j >= 0 && arr[j] > key) {\n            arr[j + 1] = arr[j];\n            j--;\n        }\n\n        arr[j + 1] = key;\n    }\n}\n\nvoid printArray(int arr[], int n) {\n    int i;\n    for (i = 0; i < n; i++) {\n        printf("%d ", arr[i]);\n    }\n    printf("\\n");\n}\n\nint main() {\n    int n, i;\n\n    printf("Enter the number of elements: ");\n    scanf("%d", &n);\n\n    int arr[n];\n\n    printf("Enter %d elements:\\n", n);\n    for (i = 0; i < n; i++) {\n        scanf("%d", &arr[i]);\n    }\n\n    printf("Original array: ");\n    printArray(arr, n);\n\n    insertionSort(arr, n);\n\n    printf("Sorted array: ");\n    printArray(arr, n);\n\n    return 0;\n}',
        },
        samples: [{ input: "5\n12 11 13 5 6", output: "5 6 11 12 13 \n" }],
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
        problemStatement: "Implement and analyze the Merge Sort algorithm.",
        theory:
          "Merge Sort is a divide-and-conquer algorithm that recursively splits the array into two halves, sorts each, and merges them. Time: O(n log n) all cases; Space: O(n) auxiliary. Stable sort, well-suited for large datasets and linked lists.",
        algorithm:
          "1. Start\n2. mergeSort(arr, left, right):\n   a. If left >= right: return\n   b. mid = (left+right)/2\n   c. mergeSort(arr, left, mid)\n   d. mergeSort(arr, mid+1, right)\n   e. merge(arr, left, mid, right)\n3. merge(): copy halves to temp arrays L[] and R[], merge back in sorted order\n4. Print sorted array\n5. Stop",
        flowchart: {
          nodes: [
            { id: "1", type: "start", label: "Start" },
            { id: "2", type: "input", label: "Read arr[], n" },
            { id: "3", type: "decision", label: "left < right?" },
            {
              id: "4",
              type: "process",
              label: "mid=(left+right)/2; recurse both halves",
            },
            { id: "5", type: "process", label: "merge(arr, left, mid, right)" },
            { id: "6", type: "output", label: "Print sorted array" },
            { id: "7", type: "end", label: "Stop" },
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
          c: '#include <stdio.h>\n\nvoid merge(int arr[], int left, int mid, int right) {\n    int i, j, k;\n    int n1 = mid - left + 1;\n    int n2 = right - mid;\n\n    int L[n1], R[n2];\n\n    for (i = 0; i < n1; i++)\n        L[i] = arr[left + i];\n\n    for (j = 0; j < n2; j++)\n        R[j] = arr[mid + 1 + j];\n\n    i = 0;\n    j = 0;\n    k = left;\n\n    while (i < n1 && j < n2) {\n        if (L[i] <= R[j]) {\n            arr[k] = L[i];\n            i++;\n        } else {\n            arr[k] = R[j];\n            j++;\n        }\n        k++;\n    }\n\n    while (i < n1) {\n        arr[k] = L[i];\n        i++;\n        k++;\n    }\n\n    while (j < n2) {\n        arr[k] = R[j];\n        j++;\n        k++;\n    }\n}\n\nvoid mergeSort(int arr[], int left, int right) {\n    if (left < right) {\n        int mid = left + (right - left) / 2;\n\n        mergeSort(arr, left, mid);\n        mergeSort(arr, mid + 1, right);\n\n        merge(arr, left, mid, right);\n    }\n}\n\nvoid printArray(int arr[], int size) {\n    int i;\n    for (i = 0; i < size; i++) {\n        printf("%d ", arr[i]);\n    }\n    printf("\\n");\n}\n\nint main() {\n    int n, i;\n\n    printf("Enter the number of elements: ");\n    scanf("%d", &n);\n\n    int arr[n];\n\n    printf("Enter %d elements:\\n", n);\n    for (i = 0; i < n; i++) {\n        scanf("%d", &arr[i]);\n    }\n\n    printf("Original array: ");\n    printArray(arr, n);\n\n    mergeSort(arr, 0, n - 1);\n\n    printf("Sorted array: ");\n    printArray(arr, n);\n\n    return 0;\n}',
        },
        samples: [
          { input: "6\n38 27 43 3 9 82", output: "3 9 27 38 43 82 \n" },
        ],
      },
      {
        part: "b",
        title: "Quick Sort",
        concepts: [
          "Divide and Conquer",
          "Sorting Algorithms",
          "Pivot Partitioning",
        ],
        hints: [
          "Choose a pivot element (e.g., the last element of the array).",
          "Partition the array such that elements smaller than the pivot are on the left and larger on the right.",
          "Recursively apply the quicksort algorithm to the left and right partitions.",
        ],
        problemStatement: "Implement and analyze the Quick Sort algorithm.",
        theory:
          "Quick Sort selects a pivot and partitions the array so smaller elements come before it and larger after. Time: O(n log n) average, O(n²) worst; Space: O(log n) stack. In-place, not stable. Generally faster than Merge Sort in practice due to cache efficiency.",
        algorithm:
          "1. Start\n2. quickSort(arr, low, high):\n   a. If low >= high: return\n   b. pi = partition(arr, low, high)\n   c. quickSort(arr, low, pi-1)\n   d. quickSort(arr, pi+1, high)\n3. partition(): pivot=arr[high]; place smaller elements before pivot; return final pivot index\n4. Print sorted array\n5. Stop",
        flowchart: {
          nodes: [
            { id: "1", type: "start", label: "Start" },
            { id: "2", type: "input", label: "Read arr[], n" },
            { id: "3", type: "decision", label: "low < high?" },
            {
              id: "4",
              type: "process",
              label: "pi = partition(arr, low, high)",
            },
            {
              id: "5",
              type: "process",
              label: "Recurse left and right of pivot",
            },
            { id: "6", type: "output", label: "Print sorted array" },
            { id: "7", type: "end", label: "Stop" },
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
          c: '#include <stdio.h>\n\nint partition(int arr[], int low, int high) {\n    int pivot = arr[high];\n    int i = low - 1;\n\n    for (int j = low; j < high; j++) {\n        if (arr[j] < pivot) {\n            i++;\n            int temp = arr[i];\n            arr[i] = arr[j];\n            arr[j] = temp;\n        }\n    }\n\n    int temp = arr[i + 1];\n    arr[i + 1] = arr[high];\n    arr[high] = temp;\n\n    return i + 1;\n}\n\nvoid quickSort(int arr[], int low, int high) {\n    if (low < high) {\n        int pi = partition(arr, low, high);\n\n        quickSort(arr, low, pi - 1);\n        quickSort(arr, pi + 1, high);\n    }\n}\n\nvoid printArray(int arr[], int n) {\n    for (int i = 0; i < n; i++) {\n        printf("%d ", arr[i]);\n    }\n    printf("\\n");\n}\n\nint main() {\n    int n;\n\n    printf("Enter the number of elements: ");\n    scanf("%d", &n);\n\n    int arr[n];\n\n    printf("Enter %d elements:\\n", n);\n    for (int i = 0; i < n; i++) {\n        scanf("%d", &arr[i]);\n    }\n\n    printf("Original array: ");\n    printArray(arr, n);\n\n    quickSort(arr, 0, n - 1);\n\n    printf("Sorted array: ");\n    printArray(arr, n);\n\n    return 0;\n}',
        },
        samples: [
          { input: "6\n10 80 30 90 40 50", output: "10 30 40 50 80 90 \n" },
        ],
      },
      {
        part: "c",
        title: "Binary Search",
        concepts: [
          "Search Algorithms",
          "Divide and Conquer",
          "Logarithmic Complexity",
        ],
        hints: [
          "Ensure the array is sorted before applying binary search.",
          "Use low and high pointers to track the current search range.",
          "Calculate the mid index and narrow the search range based on comparing target with array[mid].",
        ],
        problemStatement: "Implement and analyze the Binary Search algorithm.",
        theory:
          "Binary Search finds a target in a sorted array by repeatedly halving the search interval. Time: O(log n); Space: O(1) iterative. The array must be sorted beforehand. If mid equals the target return its index; otherwise narrow the search to the left or right half.",
        algorithm:
          "1. Start\n2. Read sorted arr[], n, key\n3. low=0, high=n-1\n4. While low <= high:\n   a. mid = (low+high)/2\n   b. If arr[mid]==key: return mid (found)\n   c. If arr[mid] < key: low = mid+1\n   d. Else: high = mid-1\n5. Return -1 (not found)\n6. Stop",
        flowchart: {
          nodes: [
            { id: "1", type: "start", label: "Start" },
            { id: "2", type: "input", label: "Read arr[], n, key" },
            { id: "3", type: "process", label: "low=0, high=n-1" },
            { id: "4", type: "decision", label: "low <= high?" },
            { id: "5", type: "process", label: "mid = (low+high)/2" },
            { id: "6", type: "decision", label: "arr[mid] == key?" },
            { id: "7", type: "output", label: "Found at index mid" },
            { id: "8", type: "process", label: "Adjust low or high" },
            { id: "9", type: "output", label: "Not Found" },
            { id: "10", type: "end", label: "Stop" },
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
            { source: "7", target: "10" },
            { source: "8", target: "4" },
            { source: "9", target: "10" },
          ],
        },
        referenceSolution: {
          c: '#include <stdio.h>\n\nint binarySearch(int arr[], int n, int key) {\n    int low = 0, high = n - 1;\n\n    while (low <= high) {\n        int mid = low + (high - low) / 2;\n\n        if (arr[mid] == key)\n            return mid;\n        else if (arr[mid] < key)\n            low = mid + 1;\n        else\n            high = mid - 1;\n    }\n\n    return -1;\n}\n\nint main() {\n    int n, key;\n\n    printf("Enter the number of elements: ");\n    scanf("%d", &n);\n\n    int arr[n];\n\n    printf("Enter %d elements in sorted order:\\n", n);\n    for (int i = 0; i < n; i++) {\n        scanf("%d", &arr[i]);\n    }\n\n    printf("Enter the element to search: ");\n    scanf("%d", &key);\n\n    int result = binarySearch(arr, n, key);\n\n    if (result != -1)\n        printf("Element found at index %d\\n", result);\n    else\n        printf("Element not found\\n");\n\n    return 0;\n}',
        },
        samples: [
          {
            input: "7\n2 3 4 10 40 50 60\n10",
            output: "Element found at index 3\n",
          },
          { input: "5\n1 3 5 7 9\n6", output: "Element not found\n" },
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
      "Experiment based on greedy approach.( Single source shortest path- Dijkstra Fractional Knapsack problem, Minimum cost spanning trees-Kruskal and Prim’s algorithm)",
    subExperiments: [
      {
        part: "a",
        title: "Dijkstra's Algorithm",
        concepts: [
          "Graph Algorithms",
          "Single Source Shortest Path",
          "Greedy Method",
        ],
        hints: [
          "Initialize distances of all vertices as infinity, and source vertex distance as 0.",
          "Repeatedly choose the unvisited vertex with the minimum distance.",
          "Relax the neighboring vertices of the selected vertex by updating their shortest path distance.",
        ],
        problemStatement:
          "Implement and analyze Dijkstra's Algorithm for Single Source Shortest Path.",
        theory:
          "Dijkstra's algorithm finds shortest paths from a source vertex to all others in a weighted graph with non-negative edges using a greedy approach. At each step it picks the unvisited vertex with the smallest known distance and relaxes its neighbors. Time: O(V²) with matrix, O((V+E) log V) with priority queue.",
        algorithm:
          "1. Start\n2. Read graph, source src\n3. dist[]=INF, dist[src]=0, visited[]=false\n4. Repeat V times:\n   a. Pick unvisited u with min dist[u], mark visited\n   b. For each neighbor v of u: if dist[u]+w < dist[v], update dist[v]\n5. Print dist[]\n6. Stop",
        flowchart: {
          nodes: [
            { id: "1", type: "start", label: "Start" },
            { id: "2", type: "input", label: "Read graph, src" },
            {
              id: "3",
              type: "process",
              label: "dist[]=INF, dist[src]=0, visited[]=false",
            },
            {
              id: "4",
              type: "process",
              label: "Pick unvisited u with min dist; mark visited",
            },
            { id: "5", type: "process", label: "Relax neighbors of u" },
            { id: "6", type: "decision", label: "All visited?" },
            { id: "7", type: "output", label: "Print dist[]" },
            { id: "8", type: "end", label: "Stop" },
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
          c: '#include <stdio.h>\n\n// Number of vertices in the graph\n#define V 5\n\n// Value representing infinity (used for initialization)\n#define INF 99999\n\n// Function to find the vertex with the minimum distance\n// that has not yet been included in the shortest path tree\nint minDistance(int dist[], int visited[]) {\n    int min = INF, minIndex = -1;\n\n    for (int v = 0; v < V; v++) {\n        if (!visited[v] && dist[v] < min) {\n            min = dist[v];\n            minIndex = v;\n        }\n    }\n\n    return minIndex;\n}\n\n// Function to implement Dijkstra\'s Algorithm\nvoid dijkstra(int graph[V][V], int src) {\n    int dist[V];      // Stores the shortest distance from source\n    int visited[V];   // Keeps track of visited vertices\n\n    // Initialize all distances as infinite and vertices as unvisited\n    for (int i = 0; i < V; i++) {\n        dist[i] = INF;\n        visited[i] = 0;\n    }\n\n    // Distance from source to itself is always 0\n    dist[src] = 0;\n\n    // Find the shortest path for all vertices\n    for (int count = 0; count < V - 1; count++) {\n        // Pick the unvisited vertex with the smallest distance\n        int u = minDistance(dist, visited);\n\n        // Mark the selected vertex as visited\n        visited[u] = 1;\n\n        // Update distance value of adjacent vertices\n        for (int v = 0; v < V; v++) {\n            // Update only if:\n            // 1. Vertex is unvisited\n            // 2. There is an edge between u and v\n            // 3. Source vertex is reachable\n            // 4. New path is shorter than the current distance\n            if (!visited[v] && graph[u][v] && dist[u] != INF &&\n                dist[u] + graph[u][v] < dist[v]) {\n                dist[v] = dist[u] + graph[u][v];\n            }\n        }\n    }\n\n    // Display the shortest distance from source to every vertex\n    printf("\\nVertex\\tDistance from Source\\n");\n    for (int i = 0; i < V; i++) {\n        printf("%d\\t%d\\n", i, dist[i]);\n    }\n}\n\nint main() {\n    // Adjacency matrix representation of the graph\n    int graph[V][V] = {\n        {0, 10, 0, 5, 0},\n        {0, 0, 1, 2, 0},\n        {0, 0, 0, 0, 4},\n        {0, 3, 9, 0, 2},\n        {7, 0, 6, 0, 0}\n    };\n\n    int source;\n\n    // Read the source vertex from the user\n    printf("Enter source vertex (0-%d): ", V - 1);\n    scanf("%d", &source);\n\n    // Call Dijkstra\'s Algorithm\n    dijkstra(graph, source);\n\n    return 0;\n}',
        },
        samples: [
          {
            input:
              "0 4 0 0 0 0 0 8 0\n4 0 8 0 0 0 0 11 0\n0 8 0 7 0 4 0 0 2\n0 0 7 0 9 14 0 0 0\n0 0 0 9 0 10 0 0 0\n0 0 4 14 10 0 2 0 0\n0 0 0 0 0 2 0 1 6\n8 11 0 0 0 0 1 0 7\n0 0 2 0 0 0 6 7 0",
            output:
              "Vertex\tDistance\n0\t0\n1\t4\n2\t12\n3\t19\n4\t21\n5\t11\n6\t9\n7\t8\n8\t14\n",
          },
        ],
      },
      {
        part: "b",
        title: "Fractional Knapsack Problem",
        concepts: [
          "Greedy Method",
          "Optimization Algorithms",
          "Fractional Relaxation",
        ],
        hints: [
          "Calculate the value-to-weight ratio for each item.",
          "Sort the items in descending order of their value-to-weight ratios.",
          "Greedily choose the items with the highest ratios, taking fractions of items if capacity is reached.",
        ],
        problemStatement:
          "Implement and analyze the Fractional Knapsack Problem.",
        theory:
          "Greedy strategy: sort items by value/weight ratio descending, take as much of each highest-ratio item as possible (fractions allowed). Time: O(n log n). Unlike 0/1 Knapsack, the greedy approach is provably optimal here.",
        algorithm:
          "1. Start\n2. Read n items (weight, value), capacity W\n3. Compute ratio = value/weight per item; sort descending by ratio\n4. For each item: if it fits fully take it; else take fraction to fill W\n5. Print total value\n6. Stop",
        flowchart: {
          nodes: [
            { id: "1", type: "start", label: "Start" },
            { id: "2", type: "input", label: "Read items, W" },
            {
              id: "3",
              type: "process",
              label: "Compute ratios; sort descending",
            },
            { id: "4", type: "decision", label: "Items left & W > 0?" },
            { id: "5", type: "process", label: "Take full or fractional item" },
            { id: "6", type: "output", label: "Print total value" },
            { id: "7", type: "end", label: "Stop" },
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
          c: '#include <stdio.h>\n\n// Structure to represent an item\nstruct Item {\n    int weight;\n    int profit;\n    float ratio; // Profit per unit weight\n};\n\n// Function to sort items in descending order of profit/weight ratio\nvoid sortItems(struct Item items[], int n) {\n    int i, j;\n    struct Item temp;\n\n    for (i = 0; i < n - 1; i++) {\n        for (j = i + 1; j < n; j++) {\n            if (items[i].ratio < items[j].ratio) {\n                temp = items[i];\n                items[i] = items[j];\n                items[j] = temp;\n            }\n        }\n    }\n}\n\nint main() {\n    int n, i;\n    float capacity, totalProfit = 0.0;\n\n    printf("Enter the number of items: ");\n    scanf("%d", &n);\n\n    struct Item items[n];\n\n    // Input weights and profits\n    for (i = 0; i < n; i++) {\n        printf("\\nEnter weight and profit of item %d: ", i + 1);\n        scanf("%d %d", &items[i].weight, &items[i].profit);\n\n        // Calculate profit-to-weight ratio\n        items[i].ratio = (float)items[i].profit / items[i].weight;\n    }\n\n    printf("\\nEnter the capacity of knapsack: ");\n    scanf("%f", &capacity);\n\n    // Sort items by highest profit/weight ratio\n    sortItems(items, n);\n\n    // Select items using greedy approach\n    for (i = 0; i < n; i++) {\n        if (capacity >= items[i].weight) {\n            // Take the entire item\n            capacity -= items[i].weight;\n            totalProfit += items[i].profit;\n        } else {\n            // Take only the required fraction of the item\n            totalProfit += items[i].ratio * capacity;\n            capacity = 0;\n            break;\n        }\n    }\n\n    printf("\\nMaximum Profit = %.2f\\n", totalProfit);\n\n    return 0;\n}',
        },
        samples: [
          {
            input: "3 50\n10 60\n20 100\n30 120",
            output: "Maximum value = 240.00\n",
          },
        ],
      },
      {
        part: "c",
        title: "Minimum Cost Spanning Trees",
        concepts: [
          "Graph Algorithms",
          "Minimum Spanning Tree",
          "Greedy Method",
        ],
        hints: [
          "For Kruskal's, sort all edges by weight and add them to the MST as long as they don't form a cycle.",
          "For Prim's, start from an arbitrary vertex and grow the tree by adding the minimum weight edge connecting the tree to unvisited vertices.",
          "An MST of a graph with V vertices always contains exactly V-1 edges and no cycles.",
        ],
        problemStatement:
          "Implement and analyze Kruskal's and Prim's algorithms for Minimum Cost Spanning Trees.",
        theory:
          "An MST spans all vertices with minimum total edge weight. Kruskal's: sort edges by weight, add non-cycle edges using Union-Find. Time: O(E log E). Prim's: grow MST from a start vertex by always adding the cheapest connecting edge. Time: O(V²) matrix, O(E log V) heap.",
        algorithm:
          "Kruskal's:\n1. Sort edges by weight\n2. For each edge (u,v): if find(u)!=find(v), add to MST, union(u,v)\n\nPrim's:\n1. key[]=INF, key[0]=0, inMST[]=false\n2. Repeat V times: pick min-key unvisited u, mark inMST\n3. Update keys of u's unvisited neighbors\n4. Print MST total cost",
        flowchart: {
          nodes: [
            { id: "1", type: "start", label: "Start" },
            { id: "2", type: "input", label: "Read graph (V, E)" },
            { id: "3", type: "process", label: "Sort edges by weight" },
            { id: "4", type: "decision", label: "Edge forms cycle?" },
            { id: "5", type: "process", label: "Add to MST (union)" },
            { id: "6", type: "decision", label: "MST has V-1 edges?" },
            { id: "7", type: "output", label: "Print MST and total cost" },
            { id: "8", type: "end", label: "Stop" },
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
          c: '#include <stdio.h>\n\n/* ========================= KRUSKAL\'S ALGORITHM ========================= */\n\nstruct Edge {\n    int src, dest, weight;\n};\n\nint find(int parent[], int i) {\n    while (parent[i] != i)\n        i = parent[i];\n    return i;\n}\n\nvoid unionSets(int parent[], int x, int y) {\n    int xroot = find(parent, x);\n    int yroot = find(parent, y);\n    parent[xroot] = yroot;\n}\n\nvoid sortEdges(struct Edge edges[], int E) {\n    struct Edge temp;\n    for (int i = 0; i < E - 1; i++) {\n        for (int j = i + 1; j < E; j++) {\n            if (edges[i].weight > edges[j].weight) {\n                temp = edges[i];\n                edges[i] = edges[j];\n                edges[j] = temp;\n            }\n        }\n    }\n}\n\nvoid kruskal() {\n    int V, E;\n\n    printf("Enter number of vertices: ");\n    scanf("%d", &V);\n\n    printf("Enter number of edges: ");\n    scanf("%d", &E);\n\n    struct Edge edges[E];\n\n    printf("Enter source, destination, weight:\\n");\n    for (int i = 0; i < E; i++) {\n        scanf("%d %d %d", &edges[i].src, &edges[i].dest, &edges[i].weight);\n    }\n\n    sortEdges(edges, E);\n\n    int parent[V];\n    for (int i = 0; i < V; i++) parent[i] = i;\n\n    int cost = 0;\n\n    printf("\\nKruskal MST:\\n");\n\n    for (int i = 0; i < E; i++) {\n        int x = find(parent, edges[i].src);\n        int y = find(parent, edges[i].dest);\n\n        if (x != y) {\n            printf("%d -- %d == %d\\n", edges[i].src, edges[i].dest, edges[i].weight);\n            cost += edges[i].weight;\n            unionSets(parent, x, y);\n        }\n    }\n\n    printf("Total Cost = %d\\n", cost);\n}\n\n\n/* ========================= PRIM\'S ALGORITHM ========================= */\n\n#define V 5\n#define INF 99999\n\nint minKey(int key[], int mstSet[]) {\n    int min = INF, minIndex;\n\n    for (int v = 0; v < V; v++) {\n        if (!mstSet[v] && key[v] < min) {\n            min = key[v];\n            minIndex = v;\n        }\n    }\n    return minIndex;\n}\n\nvoid prim() {\n    int graph[V][V] = {\n        {0, 2, 0, 6, 0},\n        {2, 0, 3, 8, 5},\n        {0, 3, 0, 0, 7},\n        {6, 8, 0, 0, 9},\n        {0, 5, 7, 9, 0}\n    };\n\n    int parent[V];\n    int key[V];\n    int mstSet[V];\n\n    for (int i = 0; i < V; i++) {\n        key[i] = INF;\n        mstSet[i] = 0;\n    }\n\n    key[0] = 0;\n    parent[0] = -1;\n\n    for (int count = 0; count < V - 1; count++) {\n        int u = minKey(key, mstSet);\n        mstSet[u] = 1;\n\n        for (int v = 0; v < V; v++) {\n            if (graph[u][v] && !mstSet[v] && graph[u][v] < key[v]) {\n                parent[v] = u;\n                key[v] = graph[u][v];\n            }\n        }\n    }\n\n    int cost = 0;\n\n    printf("\\nPrim MST:\\n");\n    printf("Edge\\tWeight\\n");\n\n    for (int i = 1; i < V; i++) {\n        printf("%d - %d\\t%d\\n", parent[i], i, graph[i][parent[i]]);\n        cost += graph[i][parent[i]];\n    }\n\n    printf("Total Cost = %d\\n", cost);\n}\n\n\n/* ========================= MAIN FUNCTION ========================= */\n\nint main() {\n    int choice;\n\n    printf("Choose Algorithm:\\n");\n    printf("1. Kruskal\\n");\n    printf("2. Prim\\n");\n    printf("Enter choice: ");\n    scanf("%d", &choice);\n\n    if (choice == 1)\n        kruskal();\n    else if (choice == 2)\n        prim();\n    else\n        printf("Invalid choice\\n");\n\n    return 0;\n}\n\n/*\nNOTE:\n- Kruskal uses edge list + sorting + union-find\n- Prim uses adjacency matrix + greedy vertex selection\n- Both find Minimum Spanning Tree (MST)\n*/',
        },
        samples: [
          {
            input: "4 5\n0 1 10\n0 2 6\n0 3 5\n1 3 15\n2 3 4",
            output:
              "Kruskal MST edges:\n2 -- 3 : 4\n0 -- 3 : 5\n0 -- 1 : 10\nTotal cost: 19\n",
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
      "Experiment using dynamic programming approach (All pair shortest path- Floyd Warshall, 0/1 knapsack)",
    subExperiments: [
      {
        part: "a",
        title: "Floyd-Warshall Algorithm",
        concepts: [
          "Dynamic Programming",
          "All-Pairs Shortest Path",
          "Graph Algorithms",
        ],
        hints: [
          "Initialize the distance matrix with direct edge weights between vertices.",
          "Iteratively update the shortest distance between all pairs of vertices using every vertex 'k' as an intermediate node.",
          "Check if distance from i to j can be minimized by passing through k: dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]).",
        ],
        problemStatement:
          "Implement and analyze the All-Pairs Shortest Path using the Floyd-Warshall algorithm.",
        theory:
          "Floyd-Warshall finds shortest paths between all vertex pairs using DP. It iterates over each vertex k as an intermediate and updates dist[i][j] = min(dist[i][j], dist[i][k]+dist[k][j]). Time: O(V³); Space: O(V²). Handles negative edges but not negative cycles.",
        algorithm:
          "1. Start\n2. Read graph[][], V\n3. Initialize dist[][] = graph[][]\n4. For k=0 to V-1:\n   For i=0 to V-1:\n     For j=0 to V-1:\n       dist[i][j] = min(dist[i][j], dist[i][k]+dist[k][j])\n5. Print dist[][]\n6. Stop",
        flowchart: {
          nodes: [
            { id: "1", type: "start", label: "Start" },
            { id: "2", type: "input", label: "Read graph[][], V" },
            { id: "3", type: "process", label: "dist[][] = graph[][]" },
            {
              id: "4",
              type: "process",
              label: "Triple loop: update dist[i][j] via k",
            },
            { id: "5", type: "output", label: "Print dist[][]" },
            { id: "6", type: "end", label: "Stop" },
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
          c: '#include <stdio.h>\n\n#define V 4\n#define INF 99999\n\n// Floyd-Warshall Algorithm for All-Pairs Shortest Path\nint main() {\n    // Adjacency matrix representation of graph\n    int graph[V][V] = {\n        {0,   5,   INF, 10},\n        {INF, 0,   3,   INF},\n        {INF, INF, 0,   1},\n        {INF, INF, INF, 0}\n    };\n\n    int dist[V][V];\n\n    // Initialize distance matrix with input graph\n    for (int i = 0; i < V; i++) {\n        for (int j = 0; j < V; j++) {\n            dist[i][j] = graph[i][j];\n        }\n    }\n\n    // Main Floyd-Warshall logic\n    // Try each vertex as an intermediate point\n    for (int k = 0; k < V; k++) {\n        for (int i = 0; i < V; i++) {\n            for (int j = 0; j < V; j++) {\n                // If path through k is shorter, update distance\n                if (dist[i][k] != INF && dist[k][j] != INF &&\n                    dist[i][k] + dist[k][j] < dist[i][j]) {\n                    dist[i][j] = dist[i][k] + dist[k][j];\n                }\n            }\n        }\n    }\n\n    // Print shortest distance matrix\n    printf("All-Pairs Shortest Path Matrix:\\n");\n    for (int i = 0; i < V; i++) {\n        for (int j = 0; j < V; j++) {\n            if (dist[i][j] == INF)\n                printf("INF\\t");\n            else\n                printf("%d\\t", dist[i][j]);\n        }\n        printf("\\n");\n    }\n\n    return 0;\n}\n\n/*\nANALYSIS:\n- Time Complexity: O(V^3)\n- Space Complexity: O(V^2)\n- Works for negative edges (but NOT negative cycles)\n- Dynamic programming based approach\n*/',
        },
        samples: [
          {
            input:
              "0 5 99999 10\n99999 0 3 99999\n99999 99999 0 1\n99999 99999 99999 0",
            output:
              "0 5 8 9 \n99999 0 3 4 \n99999 99999 0 1 \n99999 99999 99999 0 \n",
          },
        ],
      },
      {
        part: "b",
        title: "0/1 Knapsack Problem",
        concepts: [
          "Dynamic Programming",
          "Optimization Algorithms",
          "Subproblem Overlap",
        ],
        hints: [
          "Each item can either be included or excluded; fractional items are not allowed.",
          "Build a 2D DP table where dp[i][w] represents the maximum value using the first 'i' items with capacity 'w'.",
          "The recurrence relation is: dp[i][w] = max(val[i-1] + dp[i-1][w-wt[i-1]], dp[i-1][w]).",
        ],
        problemStatement: "Implement and analyze the 0/1 Knapsack problem.",
        theory:
          "0/1 Knapsack uses DP: dp[i][w] = max value using first i items with capacity w. Each item is taken whole or not at all. Time: O(nW); Space: O(nW). Answer is dp[n][W].",
        algorithm:
          "1. Start\n2. Read n items (weight, value), capacity W\n3. Init dp[n+1][W+1] = 0\n4. For i=1 to n, for w=1 to W:\n   If wt[i-1]<=w: dp[i][w]=max(val[i-1]+dp[i-1][w-wt[i-1]], dp[i-1][w])\n   Else: dp[i][w]=dp[i-1][w]\n5. Print dp[n][W]\n6. Stop",
        flowchart: {
          nodes: [
            { id: "1", type: "start", label: "Start" },
            { id: "2", type: "input", label: "Read wt[], val[], n, W" },
            { id: "3", type: "process", label: "Init dp[n+1][W+1] = 0" },
            { id: "4", type: "decision", label: "wt[i-1] <= w?" },
            {
              id: "5",
              type: "process",
              label: "dp[i][w] = max(include, exclude)",
            },
            { id: "6", type: "process", label: "dp[i][w] = dp[i-1][w]" },
            { id: "7", type: "output", label: "Print dp[n][W]" },
            { id: "8", type: "end", label: "Stop" },
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
          c: '#include <stdio.h>\n\n// Function to return maximum of two integers\nint max(int a, int b) {\n    return (a > b) ? a : b;\n}\n\nint main() {\n    int n, W;\n\n    printf("Enter number of items: ");\n    scanf("%d", &n);\n\n    int weight[n], value[n];\n\n    printf("Enter weights of items:\\n");\n    for (int i = 0; i < n; i++) {\n        scanf("%d", &weight[i]);\n    }\n\n    printf("Enter values of items:\\n");\n    for (int i = 0; i < n; i++) {\n        scanf("%d", &value[i]);\n    }\n\n    printf("Enter knapsack capacity: ");\n    scanf("%d", &W);\n\n    // DP table: rows = items, cols = capacity\n    int dp[n + 1][W + 1];\n\n    // Initialize DP table\n    for (int i = 0; i <= n; i++) {\n        for (int w = 0; w <= W; w++) {\n            if (i == 0 || w == 0)\n                dp[i][w] = 0;\n            else if (weight[i - 1] <= w)\n                dp[i][w] = max(value[i - 1] + dp[i - 1][w - weight[i - 1]],\n                               dp[i - 1][w]);\n            else\n                dp[i][w] = dp[i - 1][w];\n        }\n    }\n\n    printf("\\nMaximum Profit = %d\\n", dp[n][W]);\n\n    return 0;\n}\n\n/*\nANALYSIS:\n- Time Complexity: O(n * W)\n- Space Complexity: O(n * W)\n- Dynamic Programming approach\n- Each item is either taken or not taken (0/1 choice)\n*/',
        },
        samples: [
          {
            input: "4 5\n2 6\n2 10\n3 12\n1 5",
            output: "Maximum value = 21\n",
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
      "Travelling salesperson problem Longest common subsequence",
    subExperiments: [
      {
        part: "a",
        title: "Travelling Salesperson Problem",
        concepts: [
          "NP-Hard Problems",
          "Dynamic Programming with Bitmasking",
          "Graph Traversals",
        ],
        hints: [
          "Use bitmasking to represent the set of visited cities dynamically.",
          "Define dp[mask][i] as the minimum cost to visit all cities in the bitmask ending at city 'i'.",
          "The base case is when all cities are visited; return to the starting city to complete the round-trip.",
        ],
        problemStatement:
          "Implement and analyze the Travelling Salesperson Problem.",
        theory:
          "TSP finds the shortest round-trip visiting every city exactly once. NP-Hard. Brute-force: O((n-1)!). Held-Karp bitmask DP: dp[mask][i] = min cost to visit cities in mask ending at i. Time: O(2^n * n²).",
        algorithm:
          "1. Start\n2. Read n cities, cost[][] matrix\n3. dp[1][0]=0, all others INF\n4. For each mask; for each city i in mask; for each j not in mask:\n   dp[mask|(1<<j)][j] = min(dp[...][j], dp[mask][i]+cost[i][j])\n5. ans = min(dp[(1<<n)-1][i]+cost[i][0]) for all i\n6. Print ans\n7. Stop",
        flowchart: {
          nodes: [
            { id: "1", type: "start", label: "Start" },
            { id: "2", type: "input", label: "Read cost[][], n" },
            {
              id: "3",
              type: "process",
              label: "Init dp[mask][i]=INF; dp[1][0]=0",
            },
            {
              id: "4",
              type: "process",
              label: "Fill dp via bitmask transitions",
            },
            {
              id: "5",
              type: "process",
              label: "ans = min over dp[(1<<n)-1][i]+cost[i][0]",
            },
            { id: "6", type: "output", label: "Print minimum tour cost" },
            { id: "7", type: "end", label: "Stop" },
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
          c: '#include <stdio.h>\n\n#define N 4\n#define INF 99999\n\nint minCost = INF;\n\n// Utility function to calculate minimum cost Hamiltonian cycle\nvoid tsp(int graph[N][N], int visited[N], int currPos, int count, int cost, int start) {\n    // Base case: all cities visited\n    if (count == N && graph[currPos][start]) {\n        if (cost + graph[currPos][start] < minCost)\n            minCost = cost + graph[currPos][start];\n        return;\n    }\n\n    // Try next unvisited city\n    for (int i = 0; i < N; i++) {\n        if (!visited[i] && graph[currPos][i]) {\n            visited[i] = 1;\n            tsp(graph, visited, i, count + 1, cost + graph[currPos][i], start);\n            visited[i] = 0; // backtrack\n        }\n    }\n}\n\nint main() {\n    int graph[N][N] = {\n        {0, 10, 15, 20},\n        {10, 0, 35, 25},\n        {15, 35, 0, 30},\n        {20, 25, 30, 0}\n    };\n\n    int visited[N] = {0};\n\n    int start;\n    printf("Enter starting city (0-%d): ", N - 1);\n    scanf("%d", &start);\n\n    visited[start] = 1;\n\n    tsp(graph, visited, start, 1, 0, start);\n\n    printf("\\nMinimum Cost of Travelling Salesperson Tour = %d\\n", minCost);\n\n    return 0;\n}\n\n/*\nANALYSIS:\n- Time Complexity: O(N!) (brute force backtracking)\n- Space Complexity: O(N) recursion stack + visited array\n- Explores all possible permutations of cities\n- Suitable only for small number of cities\n*/',
        },
        samples: [
          {
            input: "4\n0 10 15 20\n10 0 35 25\n15 35 0 30\n20 25 30 0",
            output: "Minimum tour cost: 80\n",
          },
        ],
      },
      {
        part: "b",
        title: "Longest Common Subsequence",
        concepts: [
          "Dynamic Programming",
          "Sequence Alignment",
          "String Algorithms",
        ],
        hints: [
          "Create a 2D table to store lengths of longest common subsequences of prefixes.",
          "If characters match, add 1 to the diagonal cell value: dp[i][j] = dp[i-1][j-1] + 1.",
          "If characters mismatch, take the maximum of top and left cell values: dp[i][j] = max(dp[i-1][j], dp[i][j-1]).",
        ],
        problemStatement:
          "Implement and analyze the Longest Common Subsequence problem.",
        theory:
          "LCS finds the length of the longest subsequence common to two strings without reordering characters. DP approach: dp[i][j] = LCS of X[0..i-1] and Y[0..j-1]. If X[i-1]==Y[j-1]: dp[i][j]=dp[i-1][j-1]+1, else max(dp[i-1][j], dp[i][j-1]). Time: O(m*n).",
        algorithm:
          "1. Start\n2. Read strings X (length m), Y (length n)\n3. Init dp[m+1][n+1] = 0\n4. For i=1..m, j=1..n:\n   If X[i-1]==Y[j-1]: dp[i][j]=dp[i-1][j-1]+1\n   Else: dp[i][j]=max(dp[i-1][j], dp[i][j-1])\n5. Print dp[m][n]\n6. Stop",
        flowchart: {
          nodes: [
            { id: "1", type: "start", label: "Start" },
            { id: "2", type: "input", label: "Read X, Y" },
            { id: "3", type: "process", label: "Init dp[m+1][n+1]=0" },
            { id: "4", type: "decision", label: "X[i-1]==Y[j-1]?" },
            { id: "5", type: "process", label: "dp[i][j]=dp[i-1][j-1]+1" },
            {
              id: "6",
              type: "process",
              label: "dp[i][j]=max(dp[i-1][j], dp[i][j-1])",
            },
            { id: "7", type: "output", label: "Print dp[m][n]" },
            { id: "8", type: "end", label: "Stop" },
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
          c: '#include <stdio.h>\n#include <string.h>\n\n// Utility function to find max of two numbers\nint max(int a, int b) {\n    return (a > b) ? a : b;\n}\n\nint main() {\n    char X[100], Y[100];\n\n    printf("Enter first string: ");\n    scanf("%s", X);\n\n    printf("Enter second string: ");\n    scanf("%s", Y);\n\n    int m = strlen(X);\n    int n = strlen(Y);\n\n    // DP table for LCS\n    int dp[m + 1][n + 1];\n\n    // Initialize base cases\n    for (int i = 0; i <= m; i++) {\n        for (int j = 0; j <= n; j++) {\n            if (i == 0 || j == 0)\n                dp[i][j] = 0;\n        }\n    }\n\n    // Build DP table\n    for (int i = 1; i <= m; i++) {\n        for (int j = 1; j <= n; j++) {\n            if (X[i - 1] == Y[j - 1])\n                dp[i][j] = 1 + dp[i - 1][j - 1];\n            else\n                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);\n        }\n    }\n\n    printf("\\nLength of Longest Common Subsequence = %d\\n", dp[m][n]);\n\n    return 0;\n}\n\n/*\nANALYSIS:\n- Time Complexity: O(m * n)\n- Space Complexity: O(m * n)\n- Uses Dynamic Programming\n- Optimal substructure + overlapping subproblems\n*/',
        },
        samples: [{ input: "ABCBDAB BDCAB", output: "LCS length = 4\n" }],
      },
    ],
  },

  // ── Exp 6: BFS / DFS ──────────────────────────────────────────────────────────
  {
    _id: new ObjectId("685b2a1f3c4e8d0012a7b506"),
    subjectId: new ObjectId("685b2a1f3c4e8d0012a7b002"),
    experimentNumber: 6,
    problemStatement: "Experiment based on graph Algorithms ( BFS, DFS , etc)",
    subExperiments: [
      {
        part: "a",
        title: "Graph Algorithms - BFS/DFS",
        concepts: ["Graph Traversals", "Queue and Stack", "Search Algorithms"],
        hints: [
          "Use a queue for Breadth-First Search (BFS) to explore vertices level-by-level.",
          "Use recursion or a stack for Depth-First Search (DFS) to explore as deep as possible before backtracking.",
          "Maintain a visited array to keep track of explored vertices and prevent infinite loops.",
        ],
        problemStatement:
          "Implement and analyze fundamental graph algorithms including Breadth-First Search (BFS) and Depth-First Search (DFS).",
        theory:
          "BFS explores a graph level-by-level using a queue and finds the shortest path in unweighted graphs. DFS explores as deep as possible before backtracking using recursion or a stack. Both have Time: O(V+E); Space: O(V). BFS suits shortest-path problems; DFS suits topological sort and cycle detection.",
        algorithm:
          "BFS:\n1. Enqueue src, mark visited\n2. While queue not empty: dequeue u, print u, enqueue unvisited neighbors\n\nDFS (recursive):\n1. Mark v visited, print v\n2. For each unvisited neighbor: recurse",
        flowchart: {
          nodes: [
            { id: "1", type: "start", label: "Start" },
            { id: "2", type: "input", label: "Read graph (V, E), source" },
            {
              id: "3",
              type: "process",
              label: "BFS: enqueue src, process level by level",
            },
            { id: "4", type: "process", label: "DFS: recurse from src" },
            { id: "5", type: "output", label: "Print BFS and DFS traversals" },
            { id: "6", type: "end", label: "Stop" },
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
          c: '#include <stdio.h>\n\n#define V 100\n\n/* ========================= BFS IMPLEMENTATION ========================= */\n\nvoid BFS(int graph[V][V], int vertices, int start) {\n    int visited[V] = {0};\n    int queue[V], front = 0, rear = 0;\n\n    // Mark starting node as visited and enqueue it\n    visited[start] = 1;\n    queue[rear++] = start;\n\n    printf("BFS Traversal: ");\n\n    while (front < rear) {\n        int node = queue[front++];\n        printf("%d ", node);\n\n        // Visit all adjacent vertices\n        for (int i = 0; i < vertices; i++) {\n            if (graph[node][i] == 1 && !visited[i]) {\n                visited[i] = 1;\n                queue[rear++] = i;\n            }\n        }\n    }\n\n    printf("\\n");\n}\n\n/* ========================= DFS IMPLEMENTATION ========================= */\n\nvoid DFSUtil(int graph[V][V], int vertices, int node, int visited[]) {\n    visited[node] = 1;\n    printf("%d ", node);\n\n    for (int i = 0; i < vertices; i++) {\n        if (graph[node][i] == 1 && !visited[i]) {\n            DFSUtil(graph, vertices, i, visited);\n        }\n    }\n}\n\nvoid DFS(int graph[V][V], int vertices, int start) {\n    int visited[V] = {0};\n\n    printf("DFS Traversal: ");\n    DFSUtil(graph, vertices, start, visited);\n    printf("\\n");\n}\n\n/* ========================= MAIN FUNCTION ========================= */\n\nint main() {\n    int vertices, start;\n\n    printf("Enter number of vertices: ");\n    scanf("%d", &vertices);\n\n    int graph[V][V];\n\n    printf("Enter adjacency matrix:\\n");\n    for (int i = 0; i < vertices; i++) {\n        for (int j = 0; j < vertices; j++) {\n            scanf("%d", &graph[i][j]);\n        }\n    }\n\n    printf("Enter starting vertex: ");\n    scanf("%d", &start);\n\n    printf("\\n");\n    BFS(graph, vertices, start);\n    DFS(graph, vertices, start);\n\n    return 0;\n}\n\n/*\nANALYSIS:\n\nBFS:\n- Time Complexity: O(V + E)\n- Space Complexity: O(V)\n- Uses queue (level-order traversal)\n\nDFS:\n- Time Complexity: O(V + E)\n- Space Complexity: O(V)\n- Uses recursion (stack)\n\nDifference:\n- BFS explores level by level\n- DFS explores depth first\n*/',
        },
        samples: [
          {
            input: "5 5\n0 1\n0 2\n1 3\n2 4\n3 4",
            output: "BFS: 0 1 2 3 4 \nDFS: 0 1 3 4 2 \n",
          },
        ],
      },
    ],
  },

  // ── Exp 7: N-Queens, Sum of Subsets, Graph Coloring ─────────────────────────
  {
    _id: new ObjectId("685b2a1f3c4e8d0012a7b507"),
    subjectId: new ObjectId("685b2a1f3c4e8d0012a7b002"),
    experimentNumber: 7,
    problemStatement:
      "Experiment using Backtracking strategy. (N-queen problem, Sum of subsets, Graph coloring)",
    subExperiments: [
      {
        part: "a",
        title: "N-Queens Problem",
        concepts: ["Backtracking", "Constraint Satisfaction", "Recursion"],
        hints: [
          "Place queens row by row or column by column.",
          "Before placing a queen, verify if it is safe from attack by other queens (check row, column, and both diagonals).",
          "If a placement leads to no valid configurations, backtrack by removing the queen and trying the next position.",
        ],
        problemStatement: "Implement and analyze the N-Queens problem.",
        theory:
          "Place N queens on an N×N board so no two attack each other (same row, column, or diagonal). Solved by backtracking: place column by column, verify safety, and backtrack if no safe row exists. Time: O(N!); demonstrates systematic search with pruning.",
        algorithm:
          "1. Start\n2. Read N\n3. solve(col):\n   a. If col==N: print solution\n   b. For row i=0..N-1: if isSafe(i,col), place queen, recurse(col+1), remove queen\n4. isSafe(): check same row and both diagonals to the left\n5. Stop",
        flowchart: {
          nodes: [
            { id: "1", type: "start", label: "Start" },
            { id: "2", type: "input", label: "Read N" },
            { id: "3", type: "decision", label: "col == N?" },
            { id: "4", type: "output", label: "Print solution" },
            { id: "5", type: "decision", label: "isSafe(row, col)?" },
            {
              id: "6",
              type: "process",
              label: "Place queen; recurse col+1; backtrack",
            },
            { id: "7", type: "end", label: "Stop" },
          ],
          edges: [
            { source: "1", target: "2" },
            { source: "2", target: "3" },
            { source: "3", target: "4", label: "Yes" },
            { source: "3", target: "5", label: "No" },
            { source: "4", target: "7" },
            { source: "5", target: "6", label: "Yes" },
            { source: "5", target: "3", label: "No (try next row)" },
            { source: "6", target: "3" },
          ],
        },
        referenceSolution: {
          c: '#include <stdio.h>\n#define N 20\n\n// Function to print the board configuration\nvoid printSolution(int board[N][N], int n) {\n    for (int i = 0; i < n; i++) {\n        for (int j = 0; j < n; j++) {\n            printf("%d ", board[i][j]);\n        }\n        printf("\\n");\n    }\n    printf("\\n");\n}\n\n// Check if placing a queen is safe\nint isSafe(int board[N][N], int row, int col, int n) {\n    int i, j;\n\n    // Check left side of row\n    for (i = 0; i < col; i++) {\n        if (board[row][i]) return 0;\n    }\n\n    // Check upper diagonal on left side\n    for (i = row, j = col; i >= 0 && j >= 0; i--, j--) {\n        if (board[i][j]) return 0;\n    }\n\n    // Check lower diagonal on left side\n    for (i = row, j = col; i < n && j >= 0; i++, j--) {\n        if (board[i][j]) return 0;\n    }\n\n    return 1;\n}\n\n// Backtracking utility to solve N-Queens\nint solveNQUtil(int board[N][N], int col, int n) {\n    if (col >= n)\n        return 1;\n\n    for (int i = 0; i < n; i++) {\n        if (isSafe(board, i, col, n)) {\n            board[i][col] = 1;\n\n            if (solveNQUtil(board, col + 1, n))\n                return 1;\n\n            board[i][col] = 0; // backtrack\n        }\n    }\n\n    return 0;\n}\n\n// Main solver function\nvoid solveNQ(int n) {\n    int board[N][N] = {0};\n\n    if (!solveNQUtil(board, 0, n)) {\n        printf("Solution does not exist\\n");\n        return;\n    }\n\n    printSolution(board, n);\n}\n\nint main() {\n    int n;\n\n    printf("Enter value of N: ");\n    scanf("%d", &n);\n\n    solveNQ(n);\n\n    return 0;\n}\n\n/*\nANALYSIS:\n- Time Complexity: O(N!) (backtracking search)\n- Space Complexity: O(N^2) for board + recursion stack O(N)\n- Uses backtracking to place queens column by column\n- Constraint: no two queens attack each other\n*/',
        },
        samples: [
          {
            input: "4",
            output:
              "0 1 0 0 \n0 0 0 1 \n1 0 0 0 \n0 0 1 0 \n\n0 0 1 0 \n1 0 0 0 \n0 0 0 1 \n0 1 0 0 \n\n",
          },
        ],
      },
      {
        part: "b",
        title: "Sum of Subsets",
        concepts: ["Backtracking", "Subset Generation", "Pruning Techniques"],
        hints: [
          "Sort the array to enable efficient pruning when the current sum exceeds the target.",
          "At each step, make two choices: include the current element or exclude it.",
          "Backtrack if the current sum equals the target, or if the sum of remaining elements is insufficient to reach the target.",
        ],
        problemStatement: "Implement and analyze the Sum of Subsets problem.",
        theory:
          "Find all subsets of a given set that sum to target M using backtracking. Sorting enables pruning: if current sum exceeds M or remaining elements cannot contribute enough, backtrack immediately. Time: O(2^n) worst case.",
        algorithm:
          "1. Start\n2. Read set[], n, target M; sort set[]\n3. subsetSum(idx, currentSum):\n   a. If currentSum==M: print subset\n   b. For i=idx..n-1:\n      If currentSum+set[i]<=M: include set[i], recurse i+1, exclude (backtrack)\n4. Stop",
        flowchart: {
          nodes: [
            { id: "1", type: "start", label: "Start" },
            { id: "2", type: "input", label: "Read set[], n, M" },
            { id: "3", type: "process", label: "Sort set[]" },
            { id: "4", type: "decision", label: "currentSum == M?" },
            { id: "5", type: "output", label: "Print subset" },
            {
              id: "6",
              type: "process",
              label: "Include set[i]; recurse; backtrack",
            },
            { id: "7", type: "end", label: "Stop" },
          ],
          edges: [
            { source: "1", target: "2" },
            { source: "2", target: "3" },
            { source: "3", target: "4" },
            { source: "4", target: "5", label: "Yes" },
            { source: "4", target: "6", label: "No" },
            { source: "5", target: "7" },
            { source: "6", target: "4" },
          ],
        },
        referenceSolution: {
          c: '#include <stdio.h>\n\n#define MAX 100\n\nint set[MAX], n, targetSum;\nint solution[MAX];\n\n// Function to print a valid subset\nvoid printSubset(int size) {\n    printf("Subset found: ");\n    for (int i = 0; i < size; i++) {\n        printf("%d ", solution[i]);\n    }\n    printf("\\n");\n}\n\n// Backtracking function to find subsets\nvoid sumOfSubsets(int index, int currentSum, int remainingSum, int size) {\n    // If solution found\n    if (currentSum == targetSum) {\n        printSubset(size);\n        return;\n    }\n\n    // If no more elements or sum exceeds target\n    if (index >= n || currentSum > targetSum || currentSum + remainingSum < targetSum)\n        return;\n\n    // Include current element\n    solution[size] = set[index];\n    sumOfSubsets(index + 1, currentSum + set[index], remainingSum - set[index], size + 1);\n\n    // Exclude current element\n    sumOfSubsets(index + 1, currentSum, remainingSum - set[index], size);\n}\n\nint main() {\n    int totalSum = 0;\n\n    printf("Enter number of elements: ");\n    scanf("%d", &n);\n\n    printf("Enter elements (assumed sorted):\\n");\n    for (int i = 0; i < n; i++) {\n        scanf("%d", &set[i]);\n        totalSum += set[i];\n    }\n\n    printf("Enter target sum: ");\n    scanf("%d", &targetSum);\n\n    printf("\\nSubsets with sum %d:\\n", targetSum);\n\n    sumOfSubsets(0, 0, totalSum, 0);\n\n    return 0;\n}\n\n/*\nANALYSIS:\n- Time Complexity: O(2^n) worst case\n- Space Complexity: O(n) recursion depth\n- Uses backtracking (include/exclude decision tree)\n- Prunes branches using remaining sum\n*/',
        },
        samples: [
          { input: "4 6\n1 2 3 4", output: "Subset: 2 4 \nSubset: 1 2 3 \n" },
        ],
      },
      {
        part: "c",
        title: "Graph Coloring",
        concepts: ["Backtracking", "Graph Algorithms", "NP-Complete Problems"],
        hints: [
          "Assign colors to vertices one by one recursively.",
          "Ensure that no two adjacent vertices share the same color (isSafe helper check).",
          "If a vertex cannot be colored with any of the available colors, backtrack and change the color of the previously colored vertex.",
        ],
        problemStatement: "Implement and analyze the Graph Coloring problem.",
        theory:
          "Assign colors to vertices so no two adjacent vertices share the same color, using at most m colors. Solved by backtracking: try each color per vertex, backtrack on conflict. Time: O(m^V) worst case. Applications: register allocation, scheduling, map coloring.",
        algorithm:
          "1. Start\n2. Read graph, V, m\n3. colorGraph(vertex):\n   a. If vertex==V: print color[]\n   b. For c=1..m: if isSafe(vertex,c), color[vertex]=c, recurse vertex+1, color[vertex]=0\n4. isSafe(): no adjacent vertex has color c\n5. Stop",
        flowchart: {
          nodes: [
            { id: "1", type: "start", label: "Start" },
            { id: "2", type: "input", label: "Read graph, V, m" },
            { id: "3", type: "decision", label: "vertex == V?" },
            { id: "4", type: "output", label: "Print color[]" },
            { id: "5", type: "decision", label: "isSafe(vertex, c)?" },
            {
              id: "6",
              type: "process",
              label: "color[vertex]=c; recurse; backtrack",
            },
            { id: "7", type: "end", label: "Stop" },
          ],
          edges: [
            { source: "1", target: "2" },
            { source: "2", target: "3" },
            { source: "3", target: "4", label: "Yes" },
            { source: "3", target: "5", label: "No" },
            { source: "4", target: "7" },
            { source: "5", target: "6", label: "Yes" },
            { source: "5", target: "3", label: "No (try next c)" },
            { source: "6", target: "3" },
          ],
        },
        referenceSolution: {
          c: '#include <stdio.h>\n\n#define MAX 100\n\nint graph[MAX][MAX], color[MAX];\nint vertices, mColors;\n\n// Check if it is safe to assign a color to vertex\nint isSafe(int v, int c) {\n    for (int i = 0; i < vertices; i++) {\n        if (graph[v][i] == 1 && color[i] == c)\n            return 0;\n    }\n    return 1;\n}\n\n// Backtracking function for graph coloring\nint graphColoring(int v) {\n    if (v == vertices)\n        return 1;\n\n    for (int c = 1; c <= mColors; c++) {\n        if (isSafe(v, c)) {\n            color[v] = c;\n\n            if (graphColoring(v + 1))\n                return 1;\n\n            color[v] = 0; // backtrack\n        }\n    }\n\n    return 0;\n}\n\nint main() {\n    printf("Enter number of vertices: ");\n    scanf("%d", &vertices);\n\n    printf("Enter adjacency matrix:\\n");\n    for (int i = 0; i < vertices; i++) {\n        for (int j = 0; j < vertices; j++) {\n            scanf("%d", &graph[i][j]);\n        }\n    }\n\n    printf("Enter number of colors: ");\n    scanf("%d", &mColors);\n\n    for (int i = 0; i < vertices; i++)\n        color[i] = 0;\n\n    if (graphColoring(0)) {\n        printf("\\nSolution Exists:\\n");\n        for (int i = 0; i < vertices; i++) {\n            printf("Vertex %d -> Color %d\\n", i, color[i]);\n        }\n    } else {\n        printf("\\nNo solution exists with %d colors\\n", mColors);\n    }\n\n    return 0;\n}\n\n/*\nANALYSIS:\n- Time Complexity: O(m^V) where m = number of colors, V = vertices\n- Space Complexity: O(V) recursion stack + color array\n- Uses backtracking\n- Assigns colors such that no adjacent vertices share same color\n*/',
        },
        samples: [
          {
            input: "3 5\n0 1\n0 2\n1 2\n1 3\n2 3",
            output:
              "Vertex 0: Color 1\nVertex 1: Color 2\nVertex 2: Color 3\nVertex 3: Color 1\n",
          },
        ],
      },
    ],
  },

  // ── Exp 8: Branch and Bound ────────────────────────────────────────────────────
  {
    _id: new ObjectId("685b2a1f3c4e8d0012a7b508"),
    subjectId: new ObjectId("685b2a1f3c4e8d0012a7b002"),
    experimentNumber: 8,
    problemStatement: "Experiment using branch and bound strategy.",
    subExperiments: [
      {
        part: "a",
        title: "Branch and Bound Strategy",
        concepts: [
          "Branch and Bound",
          "Optimization Algorithms",
          "State Space Search",
        ],
        hints: [
          "Use a priority queue to explore state space nodes with the best potential bound first.",
          "Compute an upper bound (for maximization problems) using fractional relaxation to prune unpromising branches.",
          "Discard any node whose upper bound is less than the current best solution found.",
        ],
        problemStatement:
          "Implement and analyze optimization problems using the branch and bound strategy.",
        theory:
          "Branch and Bound systematically enumerates candidates and prunes subproblems whose best possible solution cannot beat the current best. The upper bound for 0/1 Knapsack is computed using fractional relaxation. A max-priority queue ordered by upper bound guides exploration.",
        algorithm:
          "1. Start\n2. Read items (weight, value), capacity W; sort by ratio\n3. Init priority queue with root node\n4. While queue not empty:\n   a. Dequeue node with max bound\n   b. Compute bound for children (include/exclude next item)\n   c. If bound > best: enqueue child; update best at leaf nodes\n5. Print best profit\n6. Stop",
        flowchart: {
          nodes: [
            { id: "1", type: "start", label: "Start" },
            { id: "2", type: "input", label: "Read items, W" },
            {
              id: "3",
              type: "process",
              label: "Sort by ratio; init priority queue",
            },
            { id: "4", type: "decision", label: "Queue empty?" },
            {
              id: "5",
              type: "process",
              label: "Dequeue; compute child bounds",
            },
            {
              id: "6",
              type: "process",
              label: "Enqueue promising children; update best",
            },
            { id: "7", type: "output", label: "Print max profit" },
            { id: "8", type: "end", label: "Stop" },
          ],
          edges: [
            { source: "1", target: "2" },
            { source: "2", target: "3" },
            { source: "3", target: "4" },
            { source: "4", target: "7", label: "Yes" },
            { source: "4", target: "5", label: "No" },
            { source: "5", target: "6" },
            { source: "6", target: "4" },
            { source: "7", target: "8" },
          ],
        },
        referenceSolution: {
          c: '#include <stdio.h>\n\n#define MAX 100\n\nint n, capacity;\nint weight[MAX], value[MAX];\n\n// Node structure for Branch and Bound\nstruct Node {\n    int level;\n    int profit;\n    int weight;\n    float bound;\n};\n\n// Function to compute upper bound (fractional knapsack style)\nfloat bound(struct Node u) {\n    if (u.weight >= capacity)\n        return 0;\n\n    float profitBound = u.profit;\n    int j = u.level + 1;\n    int totalWeight = u.weight;\n\n    while (j < n && totalWeight + weight[j] <= capacity) {\n        totalWeight += weight[j];\n        profitBound += value[j];\n        j++;\n    }\n\n    if (j < n)\n        profitBound += (capacity - totalWeight) * (float)value[j] / weight[j];\n\n    return profitBound;\n}\n\n// Simple queue for BFS style branch and bound\nstruct Node queue[MAX];\nint front = 0, rear = 0;\n\nvoid push(struct Node u) {\n    queue[rear++] = u;\n}\n\nstruct Node pop() {\n    return queue[front++];\n}\n\nint isEmpty() {\n    return front == rear;\n}\n\nint main() {\n    printf("Enter number of items: ");\n    scanf("%d", &n);\n\n    printf("Enter weights:\\n");\n    for (int i = 0; i < n; i++)\n        scanf("%d", &weight[i]);\n\n    printf("Enter values:\\n");\n    for (int i = 0; i < n; i++)\n        scanf("%d", &value[i]);\n\n    printf("Enter capacity: ");\n    scanf("%d", &capacity);\n\n    struct Node u, v;\n    int maxProfit = 0;\n\n    u.level = -1;\n    u.profit = 0;\n    u.weight = 0;\n    u.bound = bound(u);\n\n    push(u);\n\n    while (!isEmpty()) {\n        u = pop();\n\n        if (u.bound > maxProfit) {\n            // Include next item\n            v.level = u.level + 1;\n\n            if (v.level < n) {\n                v.weight = u.weight + weight[v.level];\n                v.profit = u.profit + value[v.level];\n\n                if (v.weight <= capacity && v.profit > maxProfit)\n                    maxProfit = v.profit;\n\n                v.bound = bound(v);\n                if (v.bound > maxProfit)\n                    push(v);\n\n                // Exclude next item\n                v.weight = u.weight;\n                v.profit = u.profit;\n                v.bound = bound(v);\n\n                if (v.bound > maxProfit)\n                    push(v);\n            }\n        }\n    }\n\n    printf("\\nMaximum Profit using Branch and Bound = %d\\n", maxProfit);\n\n    return 0;\n}\n\n/*\nANALYSIS:\n- Worst-case Time Complexity: O(2^n)\n- Best-case: Much less due to pruning\n- Space Complexity: O(2^n) (queue storage)\n- Uses bounding function to prune non-promising states\n- Combines BFS + Greedy upper bound estimation\n*/',
        },
        samples: [
          {
            input: "4 10\n2 40\n3 60\n2 30\n5 10",
            output: "Maximum profit: 100\n",
          },
        ],
      },
    ],
  },

  // ── Exp 9: Naive, Rabin-Karp, KMP ──────────────────────────────────────────────
  {
    _id: new ObjectId("685b2a1f3c4e8d0012a7b509"),
    subjectId: new ObjectId("685b2a1f3c4e8d0012a7b002"),
    experimentNumber: 9,
    problemStatement:
      "Experiment based on string matching/amortized analysis (The Naïve string- matching Algorithms , The Rabin Karp algorithm, The Knuth-Morris-Pratt algorithm.",
    subExperiments: [
      {
        part: "a",
        title: "Naive String Matching",
        concepts: ["String Matching", "Brute-force Search", "Pattern Matching"],
        hints: [
          "Slide the pattern over the text one character position at a time.",
          "Check for a match at each position by comparing characters index-by-index.",
          "The maximum number of shifts/positions to check is n-m, where n is text length and m is pattern length.",
        ],
        problemStatement:
          "Implement and analyze the Naive String-Matching algorithm.",
        theory:
          "Naive string matching slides pattern P over text T one position at a time and checks for a character-by-character match. Time: O((n-m+1)*m) worst case. Simple but inefficient for patterns with many partial matches.",
        algorithm:
          "1. Start\n2. Read text T (length n), pattern P (length m)\n3. For s=0 to n-m:\n   If T[s..s+m-1] == P: print 'Pattern found at index s'\n4. Stop",
        flowchart: {
          nodes: [
            { id: "1", type: "start", label: "Start" },
            { id: "2", type: "input", label: "Read T, P" },
            { id: "3", type: "process", label: "s = 0" },
            { id: "4", type: "decision", label: "s <= n-m?" },
            { id: "5", type: "decision", label: "T[s..s+m-1] == P?" },
            { id: "6", type: "output", label: "Print match at s" },
            { id: "7", type: "process", label: "s++" },
            { id: "8", type: "end", label: "Stop" },
          ],
          edges: [
            { source: "1", target: "2" },
            { source: "2", target: "3" },
            { source: "3", target: "4" },
            { source: "4", target: "5", label: "Yes" },
            { source: "4", target: "8", label: "No" },
            { source: "5", target: "6", label: "Yes" },
            { source: "5", target: "7", label: "No" },
            { source: "6", target: "7" },
            { source: "7", target: "4" },
          ],
        },
        referenceSolution: {
          c: '#include <stdio.h>\n#include <string.h>\n\n// Naive string matching algorithm\nvoid naiveSearch(char text[], char pattern[]) {\n    int n = strlen(text);\n    int m = strlen(pattern);\n\n    int found = 0;\n\n    // Slide pattern over text one by one\n    for (int i = 0; i <= n - m; i++) {\n        int j;\n\n        // Check for pattern match at position i\n        for (j = 0; j < m; j++) {\n            if (text[i + j] != pattern[j])\n                break;\n        }\n\n        // If full pattern matched\n        if (j == m) {\n            printf("Pattern found at index %d\\n", i);\n            found = 1;\n        }\n    }\n\n    if (!found)\n        printf("Pattern not found\\n");\n}\n\nint main() {\n    char text[200], pattern[100];\n\n    printf("Enter text: ");\n    scanf(" %[^"]", text);\n\n    printf("Enter pattern: ");\n    scanf(" %[^"]", pattern);\n\n    naiveSearch(text, pattern);\n\n    return 0;\n}\n\n/*\nANALYSIS:\n- Time Complexity:\n  Best case: O(n)\n  Worst case: O(n * m)\n- Space Complexity: O(1)\n- Simple sliding window comparison approach\n- No preprocessing required\n*/',
        },
        samples: [
          {
            input: "AABAACAADAABAABA AABA",
            output:
              "Pattern found at index 0\nPattern found at index 9\nPattern found at index 12\n",
          },
        ],
      },
      {
        part: "b",
        title: "Rabin-Karp Algorithm",
        concepts: ["String Matching", "Rolling Hash", "Pattern Matching"],
        hints: [
          "Compute hash values for the pattern and for all substrings of the text.",
          "Use a rolling hash function to update the substring hash value in O(1) time as you slide the window.",
          "Only perform character-by-character comparison if the hash values match, to handle potential hash collisions.",
        ],
        problemStatement: "Implement and analyze the Rabin-Karp algorithm.",
        theory:
          "Rabin-Karp uses a rolling hash to find pattern matches. If a window's hash matches the pattern hash, it verifies character-by-character. Rolling hash computes the next window in O(1). Average time: O(n+m); worst case: O(n*m) with many hash collisions.",
        algorithm:
          "1. Start\n2. Read T, P; compute hash(P) and hash(T[0..m-1])\n3. For s=0 to n-m:\n   a. If hashes match: verify char-by-char; if equal print match\n   b. Compute rolling hash for next window\n4. Stop",
        flowchart: {
          nodes: [
            { id: "1", type: "start", label: "Start" },
            { id: "2", type: "input", label: "Read T, P" },
            {
              id: "3",
              type: "process",
              label: "Compute hash(P) and initial window hash",
            },
            { id: "4", type: "decision", label: "s <= n-m?" },
            { id: "5", type: "decision", label: "Hash match & char match?" },
            { id: "6", type: "output", label: "Print match at s" },
            { id: "7", type: "process", label: "Compute rolling hash; s++" },
            { id: "8", type: "end", label: "Stop" },
          ],
          edges: [
            { source: "1", target: "2" },
            { source: "2", target: "3" },
            { source: "3", target: "4" },
            { source: "4", target: "5", label: "Yes" },
            { source: "4", target: "8", label: "No" },
            { source: "5", target: "6", label: "Yes" },
            { source: "5", target: "7", label: "No" },
            { source: "6", target: "7" },
            { source: "7", target: "4" },
          ],
        },
        referenceSolution: {
          c: '#include <stdio.h>\n#include <string.h>\n\n#define d 256   // number of characters in input alphabet\n#define q 101   // a prime number for hashing\n\n// Rabin-Karp pattern searching algorithm\nvoid rabinKarp(char text[], char pattern[]) {\n    int n = strlen(text);\n    int m = strlen(pattern);\n\n    int i, j;\n    int p = 0; // hash value for pattern\n    int t = 0; // hash value for text window\n    int h = 1;\n\n    // The value of h = d^(m-1) % q\n    for (i = 0; i < m - 1; i++)\n        h = (h * d) % q;\n\n    // Calculate initial hash values\n    for (i = 0; i < m; i++) {\n        p = (d * p + pattern[i]) % q;\n        t = (d * t + text[i]) % q;\n    }\n\n    // Slide pattern over text\n    for (i = 0; i <= n - m; i++) {\n\n        // Check hash values\n        if (p == t) {\n            // Check characters one by one\n            for (j = 0; j < m; j++) {\n                if (text[i + j] != pattern[j])\n                    break;\n            }\n\n            if (j == m)\n                printf("Pattern found at index %d\\n", i);\n        }\n\n        // Calculate hash for next window\n        if (i < n - m) {\n            t = (d * (t - text[i] * h) + text[i + m]) % q;\n\n            // Convert negative value to positive\n            if (t < 0)\n                t = t + q;\n        }\n    }\n}\n\nint main() {\n    char text[200], pattern[100];\n\n    printf("Enter text: ");\n    scanf(" %[^"]", text);\n\n    printf("Enter pattern: ");\n    scanf(" %[^"]", pattern);\n\n    rabinKarp(text, pattern);\n\n    return 0;\n}\n\n/*\nANALYSIS:\n- Average Time Complexity: O(n + m)\n- Worst Case Time Complexity: O(n * m) (hash collisions)\n- Space Complexity: O(1)\n- Uses rolling hash technique for efficient substring comparison\n*/',
        },
        samples: [
          {
            input: "GEEKSFORGEEKS GEEK",
            output: "Pattern found at index 0\nPattern found at index 8\n",
          },
        ],
      },
      {
        part: "c",
        title: "KMP Algorithm",
        concepts: [
          "String Matching",
          "Longest Proper Prefix/Suffix (LPS)",
          "Pattern Matching",
        ],
        hints: [
          "Preprocess the pattern to construct the LPS (Longest Proper Prefix which is also Suffix) array.",
          "Use the LPS array to skip unnecessary character comparisons when a mismatch occurs.",
          "Never backtrack the text pointer 'i'; only shift the pattern pointer 'j' based on the LPS value.",
        ],
        problemStatement:
          "Implement and analyze the Knuth-Morris-Pratt (KMP) algorithm.",
        theory:
          "KMP avoids redundant comparisons by using the LPS (Longest Proper Prefix which is also Suffix) array. On mismatch, it uses lps[] to shift the pattern without re-examining already-matched text characters. Time: O(n+m) — O(m) preprocessing + O(n) search; Space: O(m).",
        algorithm:
          "1. Start\n2. Build lps[] for P in O(m)\n3. i=0 (text), j=0 (pattern)\n4. While i < n:\n   a. If P[j]==T[i]: i++, j++\n   b. If j==m: print match at i-j; j=lps[j-1]\n   c. If mismatch and j>0: j=lps[j-1]\n   d. If mismatch and j==0: i++\n5. Stop",
        flowchart: {
          nodes: [
            { id: "1", type: "start", label: "Start" },
            { id: "2", type: "input", label: "Read T, P" },
            { id: "3", type: "process", label: "Build lps[] array" },
            { id: "4", type: "process", label: "i=0, j=0" },
            { id: "5", type: "decision", label: "i < n?" },
            { id: "6", type: "decision", label: "P[j]==T[i]?" },
            {
              id: "7",
              type: "process",
              label: "i++, j++; if j==m: print, j=lps[j-1]",
            },
            { id: "8", type: "process", label: "Mismatch: j=lps[j-1] or i++" },
            { id: "9", type: "end", label: "Stop" },
          ],
          edges: [
            { source: "1", target: "2" },
            { source: "2", target: "3" },
            { source: "3", target: "4" },
            { source: "4", target: "5" },
            { source: "5", target: "6", label: "Yes" },
            { source: "5", target: "9", label: "No" },
            { source: "6", target: "7", label: "Yes" },
            { source: "6", target: "8", label: "No" },
            { source: "7", target: "5" },
            { source: "8", target: "5" },
          ],
        },
        referenceSolution: {
          c: '#include <stdio.h>\n#include <string.h>\n\n// Function to compute Longest Prefix Suffix (LPS) array\nvoid computeLPSArray(char pattern[], int m, int lps[]) {\n    int len = 0;\n    lps[0] = 0;\n\n    int i = 1;\n    while (i < m) {\n        if (pattern[i] == pattern[len]) {\n            len++;\n            lps[i] = len;\n            i++;\n        } else {\n            if (len != 0) {\n                len = lps[len - 1];\n            } else {\n                lps[i] = 0;\n                i++;\n            }\n        }\n    }\n}\n\n// KMP pattern search function\nvoid KMPSearch(char text[], char pattern[]) {\n    int n = strlen(text);\n    int m = strlen(pattern);\n\n    int lps[m];\n\n    computeLPSArray(pattern, m, lps);\n\n    int i = 0; // index for text\n    int j = 0; // index for pattern\n\n    while (i < n) {\n        if (text[i] == pattern[j]) {\n            i++;\n            j++;\n        }\n\n        if (j == m) {\n            printf("Pattern found at index %d\\n", i - j);\n            j = lps[j - 1];\n        } else if (i < n && text[i] != pattern[j]) {\n            if (j != 0)\n                j = lps[j - 1];\n            else\n                i++;\n        }\n    }\n}\n\nint main() {\n    char text[200], pattern[100];\n\n    printf("Enter text: ");\n    scanf(" %[^"]", text);\n\n    printf("Enter pattern: ");\n    scanf(" %[^"]", pattern);\n\n    KMPSearch(text, pattern);\n\n    return 0;\n}\n\n/*\nANALYSIS:\n- Time Complexity:\n  Preprocessing (LPS): O(m)\n  Searching: O(n)\n  Total: O(n + m)\n- Space Complexity: O(m)\n- Efficient because it avoids re-checking characters using LPS array\n*/',
        },
        samples: [
          {
            input: "ABABDABACDABABCABAB ABABCABAB",
            output: "Pattern found at index 10\n",
          },
        ],
      },
    ],
  },

  // ── Exp 10: Min-Max ────────────────────────────────────────────────────────────
  {
    _id: new ObjectId("685b2a1f3c4e8d0012a7b50a"),
    subjectId: new ObjectId("685b2a1f3c4e8d0012a7b002"),
    experimentNumber: 10,
    problemStatement: "Implementation Min-Max Algorithm",
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
        problemStatement: "Implement and analyze the Min-Max algorithm.",
        theory:
          "Min-Max is used in two-player zero-sum game trees. The Maximizer picks the highest-scoring move; the Minimizer picks the lowest. The algorithm recursively evaluates all possible moves. Time: O(b^d). Alpha-Beta pruning reduces this to O(b^(d/2)) by eliminating irrelevant branches.",
        algorithm:
          "1. If depth==0 or leaf: return heuristic score\n2. If Maximizer's turn:\n   best=-INF; for each child: best=max(best, minimax(child,depth-1,false)); return best\n3. If Minimizer's turn:\n   best=+INF; for each child: best=min(best, minimax(child,depth-1,true)); return best",
        flowchart: {
          nodes: [
            { id: "1", type: "start", label: "Start" },
            { id: "2", type: "input", label: "Read game tree scores, depth" },
            { id: "3", type: "decision", label: "Leaf or depth==0?" },
            { id: "4", type: "output", label: "Return leaf score" },
            { id: "5", type: "decision", label: "Maximizer's turn?" },
            { id: "6", type: "process", label: "Return max of children" },
            { id: "7", type: "process", label: "Return min of children" },
            { id: "8", type: "output", label: "Print optimal value" },
            { id: "9", type: "end", label: "Stop" },
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
          c: '#include <stdio.h>\n\n// Structure to store minimum and maximum values\nstruct Pair {\n    int min;\n    int max;\n};\n\n// Function to find min and max using Divide and Conquer\nstruct Pair getMinMax(int arr[], int low, int high) {\n    struct Pair result, left, right;\n    int mid;\n\n    // If only one element\n    if (low == high) {\n        result.min = arr[low];\n        result.max = arr[low];\n        return result;\n    }\n\n    // If two elements\n    if (high == low + 1) {\n        if (arr[low] < arr[high]) {\n            result.min = arr[low];\n            result.max = arr[high];\n        } else {\n            result.min = arr[high];\n            result.max = arr[low];\n        }\n        return result;\n    }\n\n    // Divide array\n    mid = (low + high) / 2;\n\n    left = getMinMax(arr, low, mid);\n    right = getMinMax(arr, mid + 1, high);\n\n    // Conquer: combine results\n    result.min = (left.min < right.min) ? left.min : right.min;\n    result.max = (left.max > right.max) ? left.max : right.max;\n\n    return result;\n}\n\nint main() {\n    int n;\n\n    printf("Enter number of elements: ");\n    scanf("%d", &n);\n\n    int arr[n];\n\n    printf("Enter elements:\\n");\n    for (int i = 0; i < n; i++) {\n        scanf("%d", &arr[i]);\n    }\n\n    struct Pair result = getMinMax(arr, 0, n - 1);\n\n    printf("Minimum element = %d\\n", result.min);\n    printf("Maximum element = %d\\n", result.max);\n\n    return 0;\n}\n\n/*\nANALYSIS:\n- Time Complexity: O(n)\n  (each element is processed once in divide and conquer)\n- Space Complexity: O(log n)\n  (recursion stack)\n- Strategy: Divide array into halves, solve recursively, then combine results\n*/',
        },
        samples: [{ input: "", output: "Optimal value: 12\n" }],
      },
    ],
  },

  // ── Exp 11: Job Sequencing ──────────────────────────────────────────────────────
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
        problemStatement:
          "Implement and analyze the Job Sequencing with Deadlines problem.",
        theory:
          "Greedy approach: sort jobs by profit descending. For each job, assign it to the latest available slot at or before its deadline. Maximizes total profit. Time: O(n²). Applications: CPU scheduling, project management.",
        algorithm:
          "1. Start\n2. Read n jobs (deadline, profit)\n3. Sort by profit descending\n4. slot[]={-1} for all slots\n5. For each job: find latest free slot <= deadline; assign if found\n6. Print scheduled jobs and total profit\n7. Stop",
        flowchart: {
          nodes: [
            { id: "1", type: "start", label: "Start" },
            { id: "2", type: "input", label: "Read jobs (deadline, profit)" },
            { id: "3", type: "process", label: "Sort by profit descending" },
            { id: "4", type: "decision", label: "Jobs remaining?" },
            { id: "5", type: "decision", label: "Free slot <= deadline?" },
            { id: "6", type: "process", label: "Assign to slot; add profit" },
            {
              id: "7",
              type: "output",
              label: "Print schedule and total profit",
            },
            { id: "8", type: "end", label: "Stop" },
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
          c: '#include <stdio.h>\n\n#define MAX 100\n\n// Structure to represent a job\nstruct Job {\n    int id;\n    int deadline;\n    int profit;\n};\n\n// Sort jobs in decreasing order of profit\nvoid sortJobs(struct Job jobs[], int n) {\n    struct Job temp;\n\n    for (int i = 0; i < n - 1; i++) {\n        for (int j = i + 1; j < n; j++) {\n            if (jobs[i].profit < jobs[j].profit) {\n                temp = jobs[i];\n                jobs[i] = jobs[j];\n                jobs[j] = temp;\n            }\n        }\n    }\n}\n\n// Find maximum deadline\nint findMaxDeadline(struct Job jobs[], int n) {\n    int max = jobs[0].deadline;\n    for (int i = 1; i < n; i++) {\n        if (jobs[i].deadline > max)\n            max = jobs[i].deadline;\n    }\n    return max;\n}\n\nint main() {\n    int n;\n\n    printf("Enter number of jobs: ");\n    scanf("%d", &n);\n\n    struct Job jobs[MAX];\n\n    printf("Enter job id, deadline, profit:\\n");\n    for (int i = 0; i < n; i++) {\n        scanf("%d %d %d", &jobs[i].id, &jobs[i].deadline, &jobs[i].profit);\n    }\n\n    // Step 1: Sort jobs by profit (descending)\n    sortJobs(jobs, n);\n\n    // Step 2: Find max deadline\n    int maxDeadline = findMaxDeadline(jobs, n);\n\n    int slot[MAX] = {0}; // to track free time slots\n    int totalProfit = 0;\n\n    printf("\\nSelected Jobs:\\n");\n\n    // Step 3: Schedule jobs\n    for (int i = 0; i < n; i++) {\n        for (int j = jobs[i].deadline; j > 0; j--) {\n            if (slot[j] == 0) {\n                slot[j] = jobs[i].id;\n                totalProfit += jobs[i].profit;\n                printf("Job %d scheduled at slot %d\\n", jobs[i].id, j);\n                break;\n            }\n        }\n    }\n\n    printf("\\nTotal Profit = %d\\n", totalProfit);\n\n    return 0;\n}\n\n/*\nANALYSIS:\n- Time Complexity: O(n^2)\n  (sorting + slot searching)\n\n- Space Complexity: O(n)\n\n- Greedy Strategy:\n  1. Sort jobs by profit (descending)\n  2. Assign each job to latest available slot before deadline\n\n- Goal: Maximize total profit while meeting deadlines\n*/',
        },
        samples: [
          {
            input: "5\n2 100\n1 19\n2 27\n1 25\n3 15",
            output: "Job sequence: J1 J3 J5\nTotal profit: 142\n",
          },
        ],
      },
    ],
  },

  // ── Exp 12: Bellman-Ford ──────────────────────────────────────────────────────
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
        problemStatement:
          "Implement and analyze the Bellman-Ford Algorithm using dynamic programming.",
        theory:
          "Bellman-Ford finds shortest paths from a source in weighted directed graphs including those with negative edges (unlike Dijkstra's). Relaxes all E edges V-1 times. A V-th pass detects negative cycles. Time: O(V*E); Space: O(V). Used in RIP routing protocol.",
        algorithm:
          "1. Start\n2. Read V, E, source src\n3. dist[]=INF, dist[src]=0\n4. Repeat V-1 times:\n   For each edge (u,v,w): if dist[u]+w < dist[v], update dist[v]\n5. Check for negative cycles: if any edge still relaxes, report\n6. Print dist[]\n7. Stop",
        flowchart: {
          nodes: [
            { id: "1", type: "start", label: "Start" },
            { id: "2", type: "input", label: "Read graph, src" },
            { id: "3", type: "process", label: "dist[]=INF, dist[src]=0" },
            {
              id: "4",
              type: "process",
              label: "Relax all E edges, repeat V-1 times",
            },
            { id: "5", type: "decision", label: "Negative cycle?" },
            {
              id: "6",
              type: "output",
              label: "Print 'Negative cycle detected'",
            },
            { id: "7", type: "output", label: "Print shortest distances" },
            { id: "8", type: "end", label: "Stop" },
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
          c: '#include <stdio.h>\n\n#define V 5\n#define E 8\n#define INF 99999\n\n// Structure to represent an edge\nstruct Edge {\n    int src, dest, weight;\n};\n\nint main() {\n    // Graph represented as edge list\n    struct Edge edges[E] = {\n        {0, 1, -1},\n        {0, 2, 4},\n        {1, 2, 3},\n        {1, 3, 2},\n        {1, 4, 2},\n        {3, 2, 5},\n        {3, 1, 1},\n        {4, 3, -3}\n    };\n\n    int dist[V];\n\n    // Step 1: Initialize distances\n    for (int i = 0; i < V; i++)\n        dist[i] = INF;\n\n    int source = 0;\n    dist[source] = 0;\n\n    // Step 2: Relax all edges (V-1) times (DP idea)\n    for (int i = 1; i <= V - 1; i++) {\n        for (int j = 0; j < E; j++) {\n            int u = edges[j].src;\n            int v = edges[j].dest;\n            int w = edges[j].weight;\n\n            if (dist[u] != INF && dist[u] + w < dist[v]) {\n                dist[v] = dist[u] + w;\n            }\n        }\n    }\n\n    // Step 3: Check for negative weight cycle\n    for (int i = 0; i < E; i++) {\n        int u = edges[i].src;\n        int v = edges[i].dest;\n        int w = edges[i].weight;\n\n        if (dist[u] != INF && dist[u] + w < dist[v]) {\n            printf("Graph contains negative weight cycle\\n");\n            return 0;\n        }\n    }\n\n    // Print shortest distances\n    printf("Vertex\\tDistance from Source\\n");\n    for (int i = 0; i < V; i++) {\n        printf("%d\\t%d\\n", i, dist[i]);\n    }\n\n    return 0;\n}\n\n/*\nANALYSIS:\n- Time Complexity: O(V * E)\n- Space Complexity: O(V)\n\n- Dynamic Programming Idea:\n  dist[k][v] = shortest path using at most k edges\n  Optimized to single array with repeated relaxation\n\n- Advantage:\n  Works with negative weights and detects negative cycles\n*/',
        },
        samples: [
          {
            input:
              "5 8 0\n0 1 -1\n0 2 4\n1 2 3\n1 3 2\n1 4 2\n3 2 5\n3 1 1\n4 3 -3",
            output: "Vertex\tDistance\n0\t0\n1\t-1\n2\t2\n3\t-2\n4\t1\n",
          },
        ],
      },
    ],
  },
]; // end experiments

// ─── Seed Function ─────────────────────────────────────────────────────────────
const seedDB = async () => {
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/bh_labs";
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB...");

    // Only removes AoA data — does NOT touch C Programming or OS entries
    await Subject.deleteMany({ code: "2113115" });
    await Experiment.deleteMany({
      subjectId: new ObjectId("685b2a1f3c4e8d0012a7b002"),
    });
    console.log("Cleared existing AoA data.");

    await Subject.insertMany(subjects);
    console.log(`Seeded ${subjects.length} subject(s).`);

    await Experiment.insertMany(experiments);
    console.log(`Seeded ${experiments.length} AoA experiment(s).`);

    console.log("AoA seed completed successfully!");
  } catch (err) {
    console.error("Seeding error:", err);
  } finally {
    await mongoose.connection.close();
    console.log("Connection closed.");
  }
};

seedDB();
