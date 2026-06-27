import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

import Subject from "../models/Subject.js";
import Experiment from "../models/Experiment.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });

const {
  Types: { ObjectId },
} = mongoose;

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
    subExperiments: [
      {
        part: "a",
        title: "Selection Sort",
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
        starterCode: {
          supportedLanguages: ["c"],
          templates: {
            c: '#include <stdio.h>\n\nvoid selectionSort(int arr[], int n) {\n    // Write your code here\n    // Find minimum in unsorted portion and swap to position i\n}\n\nint main() {\n    int n;\n    scanf("%d", &n);\n    int arr[n];\n    for (int i = 0; i < n; i++) scanf("%d", &arr[i]);\n    selectionSort(arr, n);\n    for (int i = 0; i < n; i++) printf("%d ", arr[i]);\n    printf("\\n");\n    return 0;\n}',
          },
        },
        samples: [{ input: "5\n64 25 12 22 11", output: "11 12 22 25 64 \n" }],
      },
      {
        part: "b",
        title: "Insertion Sort",
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
        starterCode: {
          supportedLanguages: ["c"],
          templates: {
            c: '#include <stdio.h>\n\nvoid insertionSort(int arr[], int n) {\n    // Write your code here\n    // Pick key, shift larger elements right, insert key at correct position\n}\n\nint main() {\n    int n;\n    scanf("%d", &n);\n    int arr[n];\n    for (int i = 0; i < n; i++) scanf("%d", &arr[i]);\n    insertionSort(arr, n);\n    for (int i = 0; i < n; i++) printf("%d ", arr[i]);\n    printf("\\n");\n    return 0;\n}',
          },
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
    subExperiments: [
      {
        part: "a",
        title: "Merge Sort",
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
        starterCode: {
          supportedLanguages: ["c"],
          templates: {
            c: '#include <stdio.h>\n\nvoid merge(int arr[], int left, int mid, int right) {\n    // Write your code here\n    // Copy to temp arrays L[] and R[], then merge back in order\n}\n\nvoid mergeSort(int arr[], int left, int right) {\n    // Write your code here\n    // Base case: left < right; divide; recurse; merge\n}\n\nint main() {\n    int n;\n    scanf("%d", &n);\n    int arr[n];\n    for (int i = 0; i < n; i++) scanf("%d", &arr[i]);\n    mergeSort(arr, 0, n - 1);\n    for (int i = 0; i < n; i++) printf("%d ", arr[i]);\n    printf("\\n");\n    return 0;\n}',
          },
        },
        samples: [
          { input: "6\n38 27 43 3 9 82", output: "3 9 27 38 43 82 \n" },
        ],
      },
      {
        part: "b",
        title: "Quick Sort",
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
        starterCode: {
          supportedLanguages: ["c"],
          templates: {
            c: '#include <stdio.h>\n\nint partition(int arr[], int low, int high) {\n    // Write your code here\n    // pivot = arr[high]; place smaller elements before pivot\n    return 0;\n}\n\nvoid quickSort(int arr[], int low, int high) {\n    // Write your code here\n}\n\nint main() {\n    int n;\n    scanf("%d", &n);\n    int arr[n];\n    for (int i = 0; i < n; i++) scanf("%d", &arr[i]);\n    quickSort(arr, 0, n - 1);\n    for (int i = 0; i < n; i++) printf("%d ", arr[i]);\n    printf("\\n");\n    return 0;\n}',
          },
        },
        samples: [
          { input: "6\n10 80 30 90 40 50", output: "10 30 40 50 80 90 \n" },
        ],
      },
      {
        part: "c",
        title: "Binary Search",
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
        starterCode: {
          supportedLanguages: ["c"],
          templates: {
            c: '#include <stdio.h>\n\nint binarySearch(int arr[], int n, int key) {\n    // Write your code here\n    // Return index if found, -1 if not found\n    return -1;\n}\n\nint main() {\n    int n, key;\n    scanf("%d", &n);\n    int arr[n];\n    for (int i = 0; i < n; i++) scanf("%d", &arr[i]);\n    scanf("%d", &key);\n    int result = binarySearch(arr, n, key);\n    if (result != -1) printf("Element found at index %d\\n", result);\n    else printf("Element not found\\n");\n    return 0;\n}',
          },
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
    subExperiments: [
      {
        part: "a",
        title: "Dijkstra's Algorithm",
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
        starterCode: {
          supportedLanguages: ["c"],
          templates: {
            c: '#include <stdio.h>\n#include <limits.h>\n#define V 9\n\nint minDistance(int dist[], int visited[]) {\n    // Write your code here\n    // Return index of unvisited vertex with minimum distance\n    return 0;\n}\n\nvoid dijkstra(int graph[V][V], int src) {\n    int dist[V], visited[V];\n    // Write your code here\n    // Initialize arrays, run greedy loop V times\n}\n\nint main() {\n    int graph[V][V];\n    for (int i = 0; i < V; i++)\n        for (int j = 0; j < V; j++)\n            scanf("%d", &graph[i][j]);\n    dijkstra(graph, 0);\n    return 0;\n}',
          },
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
        starterCode: {
          supportedLanguages: ["c"],
          templates: {
            c: '#include <stdio.h>\n#include <stdlib.h>\n\ntypedef struct { int weight, value; double ratio; } Item;\n\nint compare(const void *a, const void *b) {\n    return ((Item*)b)->ratio > ((Item*)a)->ratio ? 1 : -1;\n}\n\nvoid fractionalKnapsack(Item items[], int n, int W) {\n    // Write your code here\n    // Sort by ratio, take greedily (full or fraction)\n}\n\nint main() {\n    int n, W;\n    scanf("%d %d", &n, &W);\n    Item items[n];\n    for (int i = 0; i < n; i++) {\n        scanf("%d %d", &items[i].weight, &items[i].value);\n        items[i].ratio = (double)items[i].value / items[i].weight;\n    }\n    fractionalKnapsack(items, n, W);\n    return 0;\n}',
          },
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
        starterCode: {
          supportedLanguages: ["c"],
          templates: {
            c: "#include <stdio.h>\n#include <stdlib.h>\n\n// ---- Kruskal's ----\ntypedef struct { int u, v, w; } Edge;\nint parent[100], rnk[100];\nint find(int x) { return parent[x]==x ? x : (parent[x]=find(parent[x])); }\nvoid unite(int x, int y) { /* union by rank */ }\nvoid kruskal(Edge edges[], int V, int E) {\n    // Write your code here\n    // Sort edges, add if no cycle (find-union)\n}\n\n// ---- Prim's ----\nvoid prim(int graph[][10], int V) {\n    // Write your code here\n    // key[], inMST[], greedy min-key selection\n}\n\nint main() { return 0; }",
          },
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
    subExperiments: [
      {
        part: "a",
        title: "Floyd-Warshall Algorithm",
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
        starterCode: {
          supportedLanguages: ["c"],
          templates: {
            c: '#include <stdio.h>\n#define V 4\n#define INF 99999\n\nvoid floydWarshall(int graph[V][V]) {\n    int dist[V][V];\n    // Write your code here\n    // Initialize dist from graph, then apply triple loop\n}\n\nint main() {\n    int graph[V][V];\n    for (int i = 0; i < V; i++)\n        for (int j = 0; j < V; j++)\n            scanf("%d", &graph[i][j]);\n    floydWarshall(graph);\n    return 0;\n}',
          },
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
        starterCode: {
          supportedLanguages: ["c"],
          templates: {
            c: '#include <stdio.h>\n\nint max(int a, int b) { return a > b ? a : b; }\n\nvoid knapsack(int W, int wt[], int val[], int n) {\n    int dp[n+1][W+1];\n    // Write your code here\n    // Fill dp table; print dp[n][W]\n}\n\nint main() {\n    int n, W;\n    scanf("%d %d", &n, &W);\n    int wt[n], val[n];\n    for (int i = 0; i < n; i++) scanf("%d %d", &wt[i], &val[i]);\n    knapsack(W, wt, val, n);\n    return 0;\n}',
          },
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
    subExperiments: [
      {
        part: "a",
        title: "Travelling Salesperson Problem",
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
        starterCode: {
          supportedLanguages: ["c"],
          templates: {
            c: '#include <stdio.h>\n#include <limits.h>\n#define MAXN 20\n#define INF INT_MAX\n\nint n, cost[MAXN][MAXN];\nint dp[1 << MAXN][MAXN];\n\nint tsp() {\n    // Write your code here\n    // Bitmask DP: dp[mask][i] = min cost visiting cities in mask ending at i\n    return 0;\n}\n\nint main() {\n    scanf("%d", &n);\n    for (int i = 0; i < n; i++)\n        for (int j = 0; j < n; j++)\n            scanf("%d", &cost[i][j]);\n    printf("Minimum tour cost: %d\\n", tsp());\n    return 0;\n}',
          },
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
        starterCode: {
          supportedLanguages: ["c"],
          templates: {
            c: '#include <stdio.h>\n#include <string.h>\n\nint max(int a, int b) { return a > b ? a : b; }\n\nvoid lcs(char X[], char Y[], int m, int n) {\n    int dp[m+1][n+1];\n    // Write your code here\n    // Fill dp table, print LCS length\n}\n\nint main() {\n    char X[100], Y[100];\n    scanf("%s %s", X, Y);\n    lcs(X, Y, strlen(X), strlen(Y));\n    return 0;\n}',
          },
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
    subExperiments: [
      {
        part: "-",
        title: "Graph Algorithms - BFS/DFS",
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
        starterCode: {
          supportedLanguages: ["c"],
          templates: {
            c: '#include <stdio.h>\n#include <stdlib.h>\n#define MAX 100\n\nint adj[MAX][MAX], visited[MAX], V;\n\nvoid bfs(int src) {\n    // Write your code here\n    // Queue-based level-order traversal\n}\n\nvoid dfs(int v) {\n    visited[v] = 1;\n    printf("%d ", v);\n    // Write your code here\n    // Recurse on unvisited neighbors\n}\n\nint main() {\n    int E, u, v;\n    scanf("%d %d", &V, &E);\n    for (int i = 0; i < E; i++) { scanf("%d %d", &u, &v); adj[u][v]=adj[v][u]=1; }\n    printf("BFS: "); bfs(0); printf("\\n");\n    for (int i = 0; i < V; i++) visited[i] = 0;\n    printf("DFS: "); dfs(0); printf("\\n");\n    return 0;\n}',
          },
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
    subExperiments: [
      {
        part: "a",
        title: "N-Queens Problem",
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
        starterCode: {
          supportedLanguages: ["c"],
          templates: {
            c: '#include <stdio.h>\n#define MAX 20\nint board[MAX][MAX], N;\n\nint isSafe(int row, int col) {\n    // Write your code here\n    // Check same row (left) and both diagonals (upper-left, lower-left)\n    return 1;\n}\n\nvoid printSolution() {\n    for (int i = 0; i < N; i++) {\n        for (int j = 0; j < N; j++) printf("%d ", board[i][j]);\n        printf("\\n");\n    }\n    printf("\\n");\n}\n\nvoid solve(int col) {\n    if (col == N) { printSolution(); return; }\n    // Write your code here\n    // Try each row in this column; backtrack if needed\n}\n\nint main() {\n    scanf("%d", &N);\n    solve(0);\n    return 0;\n}',
          },
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
        starterCode: {
          supportedLanguages: ["c"],
          templates: {
            c: '#include <stdio.h>\nint set[100], subset[100], n, M;\n\nvoid subsetSum(int idx, int currentSum, int size) {\n    if (currentSum == M) {\n        printf("Subset: ");\n        for (int i = 0; i < size; i++) printf("%d ", subset[i]);\n        printf("\\n"); return;\n    }\n    // Write your code here\n    // Include/exclude elements with pruning\n}\n\nint main() {\n    scanf("%d %d", &n, &M);\n    for (int i = 0; i < n; i++) scanf("%d", &set[i]);\n    subsetSum(0, 0, 0);\n    return 0;\n}',
          },
        },
        samples: [
          { input: "4 6\n1 2 3 4", output: "Subset: 2 4 \nSubset: 1 2 3 \n" },
        ],
      },
      {
        part: "c",
        title: "Graph Coloring",
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
        starterCode: {
          supportedLanguages: ["c"],
          templates: {
            c: '#include <stdio.h>\n#define V 4\nint graph[V][V], color[V];\n\nint isSafe(int v, int c) {\n    // Write your code here\n    // Return 1 if no adjacent vertex has color c\n    return 1;\n}\n\nvoid colorGraph(int v, int m) {\n    if (v == V) {\n        for (int i = 0; i < V; i++) printf("Vertex %d: Color %d\\n", i, color[i]);\n        return;\n    }\n    // Write your code here: try all colors, backtrack\n}\n\nint main() {\n    int m, E, u, v;\n    scanf("%d %d", &m, &E);\n    for (int i = 0; i < E; i++) { scanf("%d %d", &u, &v); graph[u][v]=graph[v][u]=1; }\n    colorGraph(0, m);\n    return 0;\n}',
          },
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
    subExperiments: [
      {
        part: "-",
        title: "Branch and Bound Strategy",
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
        starterCode: {
          supportedLanguages: ["c"],
          templates: {
            c: '#include <stdio.h>\n#include <stdlib.h>\n\ntypedef struct { int level, profit, weight; float bound; } Node;\n\nfloat computeBound(Node u, int n, int W, int wt[], int val[]) {\n    // Write your code here\n    // Fractional knapsack relaxation for upper bound\n    return 0.0f;\n}\n\nvoid branchAndBound(int n, int W, int wt[], int val[]) {\n    // Write your code here\n    // Priority queue ordered by bound; explore and prune\n}\n\nint main() {\n    int n, W;\n    scanf("%d %d", &n, &W);\n    int wt[n], val[n];\n    for (int i = 0; i < n; i++) scanf("%d %d", &wt[i], &val[i]);\n    branchAndBound(n, W, wt, val);\n    return 0;\n}',
          },
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
    subExperiments: [
      {
        part: "a",
        title: "Naive String Matching",
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
        starterCode: {
          supportedLanguages: ["c"],
          templates: {
            c: '#include <stdio.h>\n#include <string.h>\n\nvoid naiveSearch(char T[], char P[]) {\n    int n = strlen(T), m = strlen(P);\n    // Write your code here\n    // Slide pattern, compare character by character\n}\n\nint main() {\n    char T[1000], P[100];\n    scanf("%s %s", T, P);\n    naiveSearch(T, P);\n    return 0;\n}',
          },
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
        starterCode: {
          supportedLanguages: ["c"],
          templates: {
            c: '#include <stdio.h>\n#include <string.h>\n#define d 256\n#define q 101\n\nvoid rabinKarp(char T[], char P[]) {\n    int n = strlen(T), m = strlen(P);\n    int p_hash = 0, t_hash = 0, h = 1;\n    // Write your code here\n    // Compute hashes; slide with rolling hash; verify on match\n}\n\nint main() {\n    char T[1000], P[100];\n    scanf("%s %s", T, P);\n    rabinKarp(T, P);\n    return 0;\n}',
          },
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
        starterCode: {
          supportedLanguages: ["c"],
          templates: {
            c: '#include <stdio.h>\n#include <string.h>\n\nvoid computeLPS(char P[], int m, int lps[]) {\n    // Write your code here\n    // Build lps (longest proper prefix = suffix) array\n}\n\nvoid KMPSearch(char T[], char P[]) {\n    int n = strlen(T), m = strlen(P);\n    int lps[m];\n    computeLPS(P, m, lps);\n    // Write your code here\n    // Use lps[] to skip unnecessary comparisons\n}\n\nint main() {\n    char T[1000], P[100];\n    scanf("%s %s", T, P);\n    KMPSearch(T, P);\n    return 0;\n}',
          },
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
    subExperiments: [
      {
        part: "-",
        title: "Min-Max Algorithm",
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
        starterCode: {
          supportedLanguages: ["c"],
          templates: {
            c: '#include <stdio.h>\n#include <limits.h>\n\nint scores[] = {3, 5, 2, 9, 12, 5, 23, 23};\nint n = 8;\n\nint minimax(int depth, int nodeIdx, int isMax, int maxDepth) {\n    if (depth == maxDepth) return scores[nodeIdx];\n    // Write your code here\n    // Maximizer: return max of children\n    // Minimizer: return min of children\n    return 0;\n}\n\nint main() {\n    printf("Optimal value: %d\\n", minimax(0, 0, 1, 3));\n    return 0;\n}',
          },
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
    subExperiments: [
      {
        part: "-",
        title: "Job Sequencing with Deadlines",
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
        starterCode: {
          supportedLanguages: ["c"],
          templates: {
            c: '#include <stdio.h>\n#include <stdlib.h>\n\ntypedef struct { int id, deadline, profit; } Job;\n\nint compare(const void *a, const void *b) { return ((Job*)b)->profit - ((Job*)a)->profit; }\n\nvoid jobSequencing(Job jobs[], int n) {\n    // Write your code here\n    // Sort, then assign each job to latest free slot <= deadline\n}\n\nint main() {\n    int n; scanf("%d", &n);\n    Job jobs[n];\n    for (int i = 0; i < n; i++) { jobs[i].id=i+1; scanf("%d %d",&jobs[i].deadline,&jobs[i].profit); }\n    jobSequencing(jobs, n);\n    return 0;\n}',
          },
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
    subExperiments: [
      {
        part: "-",
        title: "Bellman-Ford Algorithm",
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
        starterCode: {
          supportedLanguages: ["c"],
          templates: {
            c: '#include <stdio.h>\n#include <limits.h>\n\ntypedef struct { int u, v, w; } Edge;\n\nvoid bellmanFord(Edge edges[], int V, int E, int src) {\n    int dist[V];\n    for (int i = 0; i < V; i++) dist[i] = INT_MAX;\n    dist[src] = 0;\n    // Write your code here\n    // Relax all edges V-1 times; check for negative cycles\n}\n\nint main() {\n    int V, E, src;\n    scanf("%d %d %d", &V, &E, &src);\n    Edge edges[E];\n    for (int i = 0; i < E; i++) scanf("%d %d %d",&edges[i].u,&edges[i].v,&edges[i].w);\n    bellmanFord(edges, V, E, src);\n    return 0;\n}',
          },
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