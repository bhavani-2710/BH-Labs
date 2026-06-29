require("dotenv").config({ path: __dirname + "/../.env" });
const mongoose = require("mongoose");
const {
  Types: { ObjectId },
} = mongoose;
const Subject = require("../models/Subject");
const Experiment = require("../models/Experiment");

const subjects = [
  {
    _id: new ObjectId("685b2a1f3c4e8d0012a7b001"),
    name: "Operating System",
    code: "2114113",
    semester: 4,
    description:
      "This subject covers practical OS experiments including process management, CPU scheduling, synchronization, memory management, file allocation, and disk scheduling.",
  },
];

const experiments = [
  {
    _id: new ObjectId("685b2a1f3c4e8d0012a7b401"),
    subjectId: new ObjectId("685b2a1f3c4e8d0012a7b001"),
    experimentNumber: 3,
    subExperiments: [
      {
        title: "Implement Basic Linux Commands",
        problemStatement:
          "Implement any one basic command of Linux like ls, cp, mv and others using kernel APIs.",
        theory:
          "Linux kernel APIs allow programs to interact directly with the OS. To implement ls, opendir() opens a directory and readdir() reads its entries. To implement cp, open() opens source and destination files, read() reads data, and write() writes it. To implement mv, rename() moves or renames a file.",
        algorithm:
          "1. Start\n2. Open directory using opendir()\n3. Read each entry using readdir()\n4. Print each entry name\n5. Close directory using closedir()\n6. Stop",
        flowchart: {
          nodes: [
            {
              id: "1",
              type: "start",
              label: "Start",
            },
            {
              id: "2",
              type: "process",
              label: "dir = opendir('.')",
            },
            {
              id: "3",
              type: "decision",
              label: "dir == NULL?",
            },
            {
              id: "4",
              type: "output",
              label: "Print error, exit",
            },
            {
              id: "5",
              type: "process",
              label: "entry = readdir(dir)",
            },
            {
              id: "6",
              type: "decision",
              label: "entry != NULL?",
            },
            {
              id: "7",
              type: "output",
              label: "Print entry->d_name",
            },
            {
              id: "8",
              type: "process",
              label: "closedir(dir)",
            },
            {
              id: "9",
              type: "end",
              label: "Stop",
            },
          ],
          edges: [
            {
              source: "1",
              target: "2",
            },
            {
              source: "2",
              target: "3",
            },
            {
              source: "3",
              target: "4",
              label: "Yes",
            },
            {
              source: "3",
              target: "5",
              label: "No",
            },
            {
              source: "5",
              target: "6",
            },
            {
              source: "6",
              target: "7",
              label: "Yes",
            },
            {
              source: "7",
              target: "5",
            },
            {
              source: "6",
              target: "8",
              label: "No",
            },
            {
              source: "8",
              target: "9",
            },
          ],
        },
        starterCode: {
          supportedLanguages: ["c"],
          templates: {
            c: "#include <stdio.h>\n#include <dirent.h>\n\nvoid implementCommand() {\n    // Write your code here (implement ls, cp, or mv)\n}\n\nint main() {\n    implementCommand();\n    return 0;\n}",
          },
        },
        samples: [
          {
            input: "",
            output: ".\n..\n",
          },
        ],
      },
    ],
  },
  {
    _id: new ObjectId("685b2a1f3c4e8d0012a7b402"),
    subjectId: new ObjectId("685b2a1f3c4e8d0012a7b001"),
    experimentNumber: 4,
    subExperiments: [
      {
        title: "Child Process using Fork",
        problemStatement:
          "Create a child process in Linux using the fork system call. From the child process obtain the process ID of both child and parent by using getpid and getppid system call.",
        theory:
          "fork() creates a new child process by duplicating the calling process. It returns 0 in the child process and the child's PID in the parent. getpid() returns the current process ID and getppid() returns the parent process ID. Both parent and child execute concurrently after the fork.",
        algorithm:
          "1. Start\n2. Call fork() to create child process\n3. If fork() returns 0, we are in child process\n4. Child: print getpid() and getppid()\n5. If fork() > 0, we are in parent process\n6. Parent: print getpid()\n7. Stop",
        flowchart: {
          nodes: [
            {
              id: "1",
              type: "start",
              label: "Start",
            },
            {
              id: "2",
              type: "process",
              label: "pid = fork()",
            },
            {
              id: "3",
              type: "decision",
              label: "pid == 0?",
            },
            {
              id: "4",
              type: "output",
              label: "Child: print getpid(), getppid()",
            },
            {
              id: "5",
              type: "output",
              label: "Parent: print getpid()",
            },
            {
              id: "6",
              type: "end",
              label: "Stop",
            },
          ],
          edges: [
            {
              source: "1",
              target: "2",
            },
            {
              source: "2",
              target: "3",
            },
            {
              source: "3",
              target: "4",
              label: "Yes (Child)",
            },
            {
              source: "3",
              target: "5",
              label: "No (Parent)",
            },
            {
              source: "4",
              target: "6",
            },
            {
              source: "5",
              target: "6",
            },
          ],
        },
        starterCode: {
          supportedLanguages: ["c"],
          templates: {
            c: "#include <stdio.h>\n#include <unistd.h>\n\nvoid processDemo() {\n    // Write your code here (use fork, getpid, getppid)\n}\n\nint main() {\n    processDemo();\n    return 0;\n}",
          },
        },
        samples: [
          {
            input: "",
            output:
              "Parent Process:\n  Parent PID: 1000\n  Child PID: 1001\nChild Process:\n  Child PID: 1001\n  Parent PID: 1000\n",
          },
        ],
      },
    ],
  },
  {
    _id: new ObjectId("685b2a1f3c4e8d0012a7b403"),
    subjectId: new ObjectId("685b2a1f3c4e8d0012a7b001"),
    experimentNumber: 5,
    subExperiments: [
      {
        title: "Non-Preemptive Scheduling",
        problemStatement:
          "Write a program to demonstrate the concept of non-preemptive scheduling algorithms (any one).",
        theory:
          "In non-preemptive scheduling, once a process is given the CPU, it runs to completion. FCFS (First Come First Serve) schedules processes in the order they arrive. SJF (Shortest Job First) picks the process with the smallest burst time. Both are non-preemptive and simple to implement but can cause convoy effect (FCFS) or starvation (SJF).",
        algorithm:
          "1. Start\n2. Read n processes with arrival time and burst time\n3. Sort by arrival time (FCFS) or burst time (SJF)\n4. Calculate start time, finish time, turnaround time, waiting time for each process\n5. Turnaround time = finish time - arrival time\n6. Waiting time = turnaround time - burst time\n7. Display Gantt chart and average times\n8. Stop",
        flowchart: {
          nodes: [
            {
              id: "1",
              type: "start",
              label: "Start",
            },
            {
              id: "2",
              type: "input",
              label: "Read n, arrival[], burst[]",
            },
            {
              id: "3",
              type: "process",
              label: "Sort by arrival time",
            },
            {
              id: "4",
              type: "process",
              label: "i = 0, time = 0",
            },
            {
              id: "5",
              type: "decision",
              label: "i < n?",
            },
            {
              id: "6",
              type: "process",
              label: "start = max(time, arrival[i])",
            },
            {
              id: "7",
              type: "process",
              label: "finish = start + burst[i]",
            },
            {
              id: "8",
              type: "process",
              label: "tat = finish - arrival[i], wt = tat - burst[i]",
            },
            {
              id: "9",
              type: "process",
              label: "time = finish, i++",
            },
            {
              id: "10",
              type: "output",
              label: "Display results",
            },
            {
              id: "11",
              type: "end",
              label: "Stop",
            },
          ],
          edges: [
            {
              source: "1",
              target: "2",
            },
            {
              source: "2",
              target: "3",
            },
            {
              source: "3",
              target: "4",
            },
            {
              source: "4",
              target: "5",
            },
            {
              source: "5",
              target: "6",
              label: "Yes",
            },
            {
              source: "6",
              target: "7",
            },
            {
              source: "7",
              target: "8",
            },
            {
              source: "8",
              target: "9",
            },
            {
              source: "9",
              target: "5",
            },
            {
              source: "5",
              target: "10",
              label: "No",
            },
            {
              source: "10",
              target: "11",
            },
          ],
        },
        starterCode: {
          supportedLanguages: ["c"],
          templates: {
            c: '#include <stdio.h>\n\nvoid fcfs(int n, int arrival[], int burst[]) {\n    // Write your code here (Non-Preemptive Scheduling)\n}\n\nint main() {\n    int n;\n    scanf("%d", &n);\n    int arrival[n], burst[n];\n    for (int i = 0; i < n; i++) scanf("%d %d", &arrival[i], &burst[i]);\n    fcfs(n, arrival, burst);\n    return 0;\n}',
          },
        },
        samples: [
          {
            input: "3\n0 5\n1 3\n2 8",
            output:
              "\nProcess | Arrival | Burst | Finish | TAT | WT\nP1      | 0       | 5     | 5      | 5   | 0\nP2      | 1       | 3     | 8      | 7   | 4\nP3      | 2       | 8     | 16     | 14  | 6\n",
          },
        ],
      },
    ],
  },
  {
    _id: new ObjectId("685b2a1f3c4e8d0012a7b404"),
    subjectId: new ObjectId("685b2a1f3c4e8d0012a7b001"),
    experimentNumber: 6,
    subExperiments: [
      {
        title: "Preemptive Scheduling",
        problemStatement:
          "Write a program to demonstrate the concept of preemptive scheduling algorithms (any one).",
        theory:
          "In preemptive scheduling, a running process can be interrupted and replaced by another. Round Robin assigns a fixed time quantum to each process in order. SRTF (Shortest Remaining Time First) preempts the current process if a new process arrives with a shorter remaining burst time. These algorithms improve response time and fairness.",
        algorithm:
          "1. Start\n2. Read n processes with arrival time and burst time\n3. Read time quantum q\n4. Use a queue and simulate Round Robin\n5. At each time unit, check if process quantum is exhausted\n6. If yes, move to next process in queue\n7. Calculate TAT and WT for each process\n8. Display results\n9. Stop",
        flowchart: {
          nodes: [
            {
              id: "1",
              type: "start",
              label: "Start",
            },
            {
              id: "2",
              type: "input",
              label: "Read n, arrival[], burst[], quantum",
            },
            {
              id: "3",
              type: "process",
              label: "Initialize remaining[] = burst[]",
            },
            {
              id: "4",
              type: "process",
              label: "time = 0, completed = 0",
            },
            {
              id: "5",
              type: "decision",
              label: "completed < n?",
            },
            {
              id: "6",
              type: "process",
              label: "Execute process for min(remaining, quantum)",
            },
            {
              id: "7",
              type: "process",
              label: "Update remaining, time",
            },
            {
              id: "8",
              type: "decision",
              label: "remaining == 0?",
            },
            {
              id: "9",
              type: "process",
              label: "Record finish time, completed++",
            },
            {
              id: "10",
              type: "output",
              label: "Display TAT, WT",
            },
            {
              id: "11",
              type: "end",
              label: "Stop",
            },
          ],
          edges: [
            {
              source: "1",
              target: "2",
            },
            {
              source: "2",
              target: "3",
            },
            {
              source: "3",
              target: "4",
            },
            {
              source: "4",
              target: "5",
            },
            {
              source: "5",
              target: "6",
              label: "Yes",
            },
            {
              source: "6",
              target: "7",
            },
            {
              source: "7",
              target: "8",
            },
            {
              source: "8",
              target: "9",
              label: "Yes",
            },
            {
              source: "8",
              target: "5",
              label: "No",
            },
            {
              source: "9",
              target: "5",
            },
            {
              source: "5",
              target: "10",
              label: "No",
            },
            {
              source: "10",
              target: "11",
            },
          ],
        },
        starterCode: {
          supportedLanguages: ["c"],
          templates: {
            c: '#include <stdio.h>\n\nvoid roundRobin(int n, int q, int arrival[], int burst[]) {\n    // Write your code here (Preemptive Scheduling)\n}\n\nint main() {\n    int n, q;\n    scanf("%d %d", &n, &q);\n    int arrival[n], burst[n];\n    for (int i = 0; i < n; i++) scanf("%d %d", &arrival[i], &burst[i]);\n    roundRobin(n, q, arrival, burst);\n    return 0;\n}',
          },
        },
        samples: [
          {
            input: "3 2\n0 5\n1 3\n2 8",
            output: "TAT and WT for processes displayed.\n",
          },
        ],
      },
    ],
  },
  {
    _id: new ObjectId("685b2a1f3c4e8d0012a7b405"),
    subjectId: new ObjectId("685b2a1f3c4e8d0012a7b001"),
    experimentNumber: 7,
    subExperiments: [
      {
        title: "Producer Consumer Problem",
        problemStatement:
          "Write a C program to implement solution of Producer Consumer problem through Semaphore.",
        theory:
          "The Producer-Consumer problem is a classic synchronization problem. A producer generates data and puts it in a buffer; a consumer takes data from the buffer. Semaphores control access: 'empty' counts empty slots, 'full' counts filled slots, and 'mutex' ensures mutual exclusion. sem_wait() decrements and sem_post() increments a semaphore.",
        algorithm:
          "1. Start\n2. Initialize semaphores: empty = BUFFER_SIZE, full = 0, mutex = 1\n3. Producer: sem_wait(empty), sem_wait(mutex), produce item, sem_post(mutex), sem_post(full)\n4. Consumer: sem_wait(full), sem_wait(mutex), consume item, sem_post(mutex), sem_post(empty)\n5. Run producer and consumer as threads\n6. Stop",
        flowchart: {
          nodes: [
            {
              id: "1",
              type: "start",
              label: "Start",
            },
            {
              id: "2",
              type: "process",
              label: "Init: empty=N, full=0, mutex=1",
            },
            {
              id: "3",
              type: "process",
              label: "Producer: sem_wait(empty)",
            },
            {
              id: "4",
              type: "process",
              label: "sem_wait(mutex)",
            },
            {
              id: "5",
              type: "process",
              label: "Add item to buffer",
            },
            {
              id: "6",
              type: "process",
              label: "sem_post(mutex), sem_post(full)",
            },
            {
              id: "7",
              type: "process",
              label: "Consumer: sem_wait(full)",
            },
            {
              id: "8",
              type: "process",
              label: "sem_wait(mutex)",
            },
            {
              id: "9",
              type: "process",
              label: "Remove item from buffer",
            },
            {
              id: "10",
              type: "process",
              label: "sem_post(mutex), sem_post(empty)",
            },
            {
              id: "11",
              type: "end",
              label: "Stop",
            },
          ],
          edges: [
            {
              source: "1",
              target: "2",
            },
            {
              source: "2",
              target: "3",
            },
            {
              source: "3",
              target: "4",
            },
            {
              source: "4",
              target: "5",
            },
            {
              source: "5",
              target: "6",
            },
            {
              source: "6",
              target: "7",
            },
            {
              source: "7",
              target: "8",
            },
            {
              source: "8",
              target: "9",
            },
            {
              source: "9",
              target: "10",
            },
            {
              source: "10",
              target: "11",
            },
          ],
        },
        starterCode: {
          supportedLanguages: ["c"],
          templates: {
            c: "#include <stdio.h>\n#include <pthread.h>\n#include <semaphore.h>\n\nvoid* producer(void* arg) {\n    // Write your code here\n    return NULL;\n}\n\nvoid* consumer(void* arg) {\n    // Write your code here\n    return NULL;\n}\n\nint main() {\n    // Initialize semaphores and run threads\n    return 0;\n}",
          },
        },
        samples: [
          {
            input: "",
            output: "Produced: 0\nConsumed: 0\n",
          },
        ],
      },
    ],
  },
  {
    _id: new ObjectId("685b2a1f3c4e8d0012a7b406"),
    subjectId: new ObjectId("685b2a1f3c4e8d0012a7b001"),
    experimentNumber: 8,
    subExperiments: [
      {
        title: "Banker's Algorithm",
        problemStatement:
          "Write a program to demonstrate the concept of deadlock avoidance through Banker's Algorithm.",
        theory:
          "Banker's Algorithm is a deadlock avoidance algorithm. It checks whether granting a resource request will leave the system in a safe state. A safe state means there exists a sequence of processes that can all complete. It uses the Need matrix (Max - Allocation), Available resources, and simulates process execution to find a safe sequence.",
        algorithm:
          "1. Start\n2. Read n processes, m resources, Allocation matrix, Max matrix, Available vector\n3. Calculate Need = Max - Allocation\n4. Initialize Finish[] = false, Work[] = Available\n5. Find a process i where Finish[i] == false and Need[i] <= Work\n6. If found: Work += Allocation[i], Finish[i] = true, add to safe sequence\n7. Repeat until all processes finish or no process found\n8. If all finish: Safe state, print sequence. Else: Unsafe state\n9. Stop",
        flowchart: {
          nodes: [
            {
              id: "1",
              type: "start",
              label: "Start",
            },
            {
              id: "2",
              type: "input",
              label: "Read Allocation, Max, Available",
            },
            {
              id: "3",
              type: "process",
              label: "Need = Max - Allocation",
            },
            {
              id: "4",
              type: "process",
              label: "Work = Available, Finish[] = false",
            },
            {
              id: "5",
              type: "decision",
              label: "Find P[i]: !Finish[i] && Need[i]<=Work",
            },
            {
              id: "6",
              type: "process",
              label: "Work += Alloc[i], Finish[i]=true",
            },
            {
              id: "7",
              type: "decision",
              label: "All Finish == true?",
            },
            {
              id: "8",
              type: "output",
              label: "Safe State: print sequence",
            },
            {
              id: "9",
              type: "output",
              label: "Unsafe State",
            },
            {
              id: "10",
              type: "end",
              label: "Stop",
            },
          ],
          edges: [
            {
              source: "1",
              target: "2",
            },
            {
              source: "2",
              target: "3",
            },
            {
              source: "3",
              target: "4",
            },
            {
              source: "4",
              target: "5",
            },
            {
              source: "5",
              target: "6",
              label: "Found",
            },
            {
              source: "6",
              target: "5",
            },
            {
              source: "5",
              target: "7",
              label: "Not Found",
            },
            {
              source: "7",
              target: "8",
              label: "Yes",
            },
            {
              source: "7",
              target: "9",
              label: "No",
            },
            {
              source: "8",
              target: "10",
            },
            {
              source: "9",
              target: "10",
            },
          ],
        },
        starterCode: {
          supportedLanguages: ["c"],
          templates: {
            c: '#include <stdio.h>\n\nvoid bankersAlgorithm(int n, int m, int alloc[][10], int max[][10], int avail[]) {\n    // Write your code here (Deadlock avoidance)\n}\n\nint main() {\n    int n, m;\n    scanf("%d %d", &n, &m);\n    int alloc[10][10], max[10][10], avail[10];\n    for(int i=0; i<n; i++) for(int j=0; j<m; j++) scanf("%d", &alloc[i][j]);\n    for(int i=0; i<n; i++) for(int j=0; j<m; j++) scanf("%d", &max[i][j]);\n    for(int j=0; j<m; j++) scanf("%d", &avail[j]);\n    bankersAlgorithm(n, m, alloc, max, avail);\n    return 0;\n}',
          },
        },
        samples: [
          {
            input:
              "5 3\n0 1 0\n2 0 0\n3 0 2\n2 1 1\n0 0 2\n7 5 3\n3 2 2\n9 0 2\n2 2 2\n4 3 3\n3 3 2",
            output: "Safe State: print sequence\n",
          },
        ],
      },
    ],
  },
  {
    _id: new ObjectId("685b2a1f3c4e8d0012a7b407"),
    subjectId: new ObjectId("685b2a1f3c4e8d0012a7b001"),
    experimentNumber: 9,
    subExperiments: [
      {
        title: "MVT and MFT Memory Management",
        problemStatement:
          "Write a program to demonstrate the concept of MVT and MFT memory management techniques.",
        theory:
          "MFT (Multiprogramming with Fixed number of Tasks) divides memory into fixed-size partitions. Each process is loaded into a partition. Internal fragmentation occurs when a process is smaller than the partition. MVT (Multiprogramming with Variable number of Tasks) allocates exactly the memory needed by each process. External fragmentation can occur as free holes form between allocated blocks.",
        algorithm:
          "1. Start\n2. For MFT: define fixed partitions, assign processes to partitions, show internal fragmentation\n3. For MVT: maintain a free memory list, allocate exact memory for each process, show external fragmentation\n4. Display memory layout after each allocation\n5. Stop",
        flowchart: {
          nodes: [
            {
              id: "1",
              type: "start",
              label: "Start",
            },
            {
              id: "2",
              type: "input",
              label: "Read total memory, partition size (MFT)",
            },
            {
              id: "3",
              type: "process",
              label: "Create fixed partitions",
            },
            {
              id: "4",
              type: "input",
              label: "Read process sizes",
            },
            {
              id: "5",
              type: "process",
              label: "Assign each process to a partition",
            },
            {
              id: "6",
              type: "output",
              label: "Show partition map and fragmentation",
            },
            {
              id: "7",
              type: "input",
              label: "Read process sizes (MVT)",
            },
            {
              id: "8",
              type: "process",
              label: "Allocate exact memory for each",
            },
            {
              id: "9",
              type: "output",
              label: "Show memory map",
            },
            {
              id: "10",
              type: "end",
              label: "Stop",
            },
          ],
          edges: [
            {
              source: "1",
              target: "2",
            },
            {
              source: "2",
              target: "3",
            },
            {
              source: "3",
              target: "4",
            },
            {
              source: "4",
              target: "5",
            },
            {
              source: "5",
              target: "6",
            },
            {
              source: "6",
              target: "7",
            },
            {
              source: "7",
              target: "8",
            },
            {
              source: "8",
              target: "9",
            },
            {
              source: "9",
              target: "10",
            },
          ],
        },
        starterCode: {
          supportedLanguages: ["c"],
          templates: {
            c: '#include <stdio.h>\n\nvoid mft(int pSize, int processes[], int n) {\n    // Write your code here\n}\n\nvoid mvt(int processes[], int n, int totalMemory) {\n    // Write your code here\n}\n\nint main() {\n    int n, totalMemory, pSize;\n    scanf("%d %d %d", &n, &totalMemory, &pSize);\n    int processes[n];\n    for (int i = 0; i < n; i++) scanf("%d", &processes[i]);\n    mft(pSize, processes, n);\n    mvt(processes, n, totalMemory);\n    return 0;\n}',
          },
        },
        samples: [
          {
            input: "4 1024 256\n200 150 300 100",
            output:
              "\n--- MFT ---\nPartition Size: 256 KB\nP1 (200 KB) -> Partition 1 | Internal Frag: 56 KB\n",
          },
        ],
      },
    ],
  },
  {
    _id: new ObjectId("685b2a1f3c4e8d0012a7b408"),
    subjectId: new ObjectId("685b2a1f3c4e8d0012a7b001"),
    experimentNumber: 10,
    subExperiments: [
      {
        title: "Dynamic Partitioning",
        problemStatement:
          "Write a program to demonstrate the concept of dynamic partitioning placement algorithms i.e. Best Fit, First Fit, Worst-Fit etc.",
        theory:
          "Dynamic partitioning allocates memory based on process size. First Fit allocates the first hole that is large enough. Best Fit allocates the smallest hole that fits the process, minimizing wasted space. Worst Fit allocates the largest hole, leaving large remaining fragments. All three scan the free memory list differently.",
        algorithm:
          "1. Start\n2. Read memory blocks and process sizes\n3. First Fit: scan from start, allocate first block >= process size\n4. Best Fit: scan all, allocate smallest block >= process size\n5. Worst Fit: scan all, allocate largest block >= process size\n6. Display allocation results for each algorithm\n7. Stop",
        flowchart: {
          nodes: [
            {
              id: "1",
              type: "start",
              label: "Start",
            },
            {
              id: "2",
              type: "input",
              label: "Read blocks[], processes[]",
            },
            {
              id: "3",
              type: "process",
              label: "First Fit: find first block >= process",
            },
            {
              id: "4",
              type: "process",
              label: "Best Fit: find smallest block >= process",
            },
            {
              id: "5",
              type: "process",
              label: "Worst Fit: find largest block >= process",
            },
            {
              id: "6",
              type: "output",
              label: "Display allocation table",
            },
            {
              id: "7",
              type: "end",
              label: "Stop",
            },
          ],
          edges: [
            {
              source: "1",
              target: "2",
            },
            {
              source: "2",
              target: "3",
            },
            {
              source: "3",
              target: "4",
            },
            {
              source: "4",
              target: "5",
            },
            {
              source: "5",
              target: "6",
            },
            {
              source: "6",
              target: "7",
            },
          ],
        },
        starterCode: {
          supportedLanguages: ["c"],
          templates: {
            c: "#include <stdio.h>\n\nvoid firstFit(int blocks[], int m, int processes[], int n) { \n    // Write your code here\n}\n\nvoid bestFit(int blocks[], int m, int processes[], int n) { \n    // Write your code here\n}\n\nvoid worstFit(int blocks[], int m, int processes[], int n) { \n    // Write your code here\n}\n\nint main() {\n    int blocks[] = {100, 500, 200, 300, 600};\n    int processes[] = {212, 417, 112, 426};\n    int m = 5, n = 4;\n    firstFit(blocks, m, processes, n);\n    bestFit(blocks, m, processes, n);\n    worstFit(blocks, m, processes, n);\n    return 0;\n}",
          },
        },
        samples: [
          {
            input: "",
            output:
              "\nFirst Fit:\nProcess\tSize\tBlock\nP1\t212\t2\nP2\t417\t5\nP3\t112\t2\nP4\t426\t-1\n",
          },
        ],
      },
    ],
  },
  {
    _id: new ObjectId("685b2a1f3c4e8d0012a7b409"),
    subjectId: new ObjectId("685b2a1f3c4e8d0012a7b001"),
    experimentNumber: 11,
    subExperiments: [
      {
        title: "Virtual Memory / Demand Paging",
        problemStatement:
          "Write a program to demonstrate the concept of demand paging for simulation of Virtual Memory implementation.",
        theory:
          "Demand paging loads pages into memory only when they are needed. When a page is not in memory, a page fault occurs and the OS loads the page from disk. A page table tracks which pages are in memory. This allows programs larger than physical memory to run by using disk as an extension of RAM.",
        algorithm:
          "1. Start\n2. Read page reference string and number of frames\n3. Initialize all frames as empty (-1)\n4. For each page in reference string:\n5. Check if page is already in a frame (no page fault)\n6. If not, page fault occurs: load page into a free frame or replace using a policy\n7. Count total page faults\n8. Display frame state after each reference\n9. Stop",
        flowchart: {
          nodes: [
            {
              id: "1",
              type: "start",
              label: "Start",
            },
            {
              id: "2",
              type: "input",
              label: "Read pages[], frames count",
            },
            {
              id: "3",
              type: "process",
              label: "Initialize frames[] = -1, faults = 0",
            },
            {
              id: "4",
              type: "process",
              label: "i = 0",
            },
            {
              id: "5",
              type: "decision",
              label: "i < page count?",
            },
            {
              id: "6",
              type: "decision",
              label: "Page in frames?",
            },
            {
              id: "7",
              type: "process",
              label: "Page fault: load page, faults++",
            },
            {
              id: "8",
              type: "output",
              label: "Display frame state",
            },
            {
              id: "9",
              type: "process",
              label: "i++",
            },
            {
              id: "10",
              type: "output",
              label: "Print total faults",
            },
            {
              id: "11",
              type: "end",
              label: "Stop",
            },
          ],
          edges: [
            {
              source: "1",
              target: "2",
            },
            {
              source: "2",
              target: "3",
            },
            {
              source: "3",
              target: "4",
            },
            {
              source: "4",
              target: "5",
            },
            {
              source: "5",
              target: "6",
              label: "Yes",
            },
            {
              source: "6",
              target: "7",
              label: "No (Page Fault)",
            },
            {
              source: "6",
              target: "8",
              label: "Yes (Hit)",
            },
            {
              source: "7",
              target: "8",
            },
            {
              source: "8",
              target: "9",
            },
            {
              source: "9",
              target: "5",
            },
            {
              source: "5",
              target: "10",
              label: "No",
            },
            {
              source: "10",
              target: "11",
            },
          ],
        },
        starterCode: {
          supportedLanguages: ["c"],
          templates: {
            c: '#include <stdio.h>\n\nvoid demandPaging(int frames, int n, int pages[]) {\n    // Write your code here\n}\n\nint main() {\n    int frames, n;\n    scanf("%d %d", &frames, &n);\n    int pages[n];\n    for (int i = 0; i < n; i++) scanf("%d", &pages[i]);\n    demandPaging(frames, n, pages);\n    return 0;\n}',
          },
        },
        samples: [
          {
            input: "3 13\n7 0 1 2 0 3 0 4 2 3 0 3 2",
            output:
              "\nPage\tFrames\t\t\tFault\n7\t7 -1 -1 \t*\n0\t7 0 -1 \t*\n1\t7 0 1 \t*\n2\t2 0 1 \t*\nTotal Page Faults: 9\n",
          },
        ],
      },
    ],
  },
  {
    _id: new ObjectId("685b2a1f3c4e8d0012a7b410"),
    subjectId: new ObjectId("685b2a1f3c4e8d0012a7b001"),
    experimentNumber: 12,
    subExperiments: [
      {
        title: "Page Replacement Policies",
        problemStatement:
          "Write a program in C to demonstrate the concept of page replacement policies for handling page faults eg: FIFO, LRU etc.",
        theory:
          "Page replacement algorithms decide which page to evict when a page fault occurs and frames are full. FIFO removes the oldest loaded page. LRU (Least Recently Used) removes the page not used for the longest time. Optimal replaces the page that will not be used for the longest time in future. LRU generally performs better than FIFO but requires tracking usage history.",
        algorithm:
          "1. Start\n2. Read page reference string and number of frames\n3. FIFO: maintain a queue, replace front when full\n4. LRU: track last used time for each frame, replace least recently used\n5. Count page faults for each algorithm\n6. Display results\n7. Stop",
        flowchart: {
          nodes: [
            {
              id: "1",
              type: "start",
              label: "Start",
            },
            {
              id: "2",
              type: "input",
              label: "Read pages[], frames",
            },
            {
              id: "3",
              type: "process",
              label: "Run FIFO, count faults",
            },
            {
              id: "4",
              type: "process",
              label: "Run LRU, count faults",
            },
            {
              id: "5",
              type: "output",
              label: "Display FIFO faults, LRU faults",
            },
            {
              id: "6",
              type: "end",
              label: "Stop",
            },
          ],
          edges: [
            {
              source: "1",
              target: "2",
            },
            {
              source: "2",
              target: "3",
            },
            {
              source: "3",
              target: "4",
            },
            {
              source: "4",
              target: "5",
            },
            {
              source: "5",
              target: "6",
            },
          ],
        },
        starterCode: {
          supportedLanguages: ["c"],
          templates: {
            c: '#include <stdio.h>\n\nint fifo(int pages[], int n, int frames) { \n    // Write your code here\n    return 0; \n}\n\nint lru(int pages[], int n, int frames) { \n    // Write your code here\n    return 0; \n}\n\nint main() {\n    int frames, n;\n    scanf("%d %d", &frames, &n);\n    int pages[n];\n    for (int i = 0; i < n; i++) scanf("%d", &pages[i]);\n    printf("FIFO Page Faults: %d\\n", fifo(pages, n, frames));\n    printf("LRU Page Faults: %d\\n", lru(pages, n, frames));\n    return 0;\n}',
          },
        },
        samples: [
          {
            input: "3 13\n7 0 1 2 0 3 0 4 2 3 0 3 2",
            output: "FIFO Page Faults: 15\nLRU Page Faults: 10\n",
          },
        ],
      },
    ],
  },
  {
    _id: new ObjectId("685b2a1f3c4e8d0012a7b411"),
    subjectId: new ObjectId("685b2a1f3c4e8d0012a7b001"),
    experimentNumber: 13,
    subExperiments: [
      {
        title: "File Allocation Strategies",
        problemStatement:
          "Write a C program to simulate File allocation strategies typically sequential, indexed and linked files.",
        theory:
          "Sequential allocation stores file blocks contiguously on disk — fast access but suffers from external fragmentation. Linked allocation uses pointers in each block to point to the next — no fragmentation but slow random access. Indexed allocation uses an index block that holds pointers to all file blocks — supports direct access and no external fragmentation.",
        algorithm:
          "1. Start\n2. Sequential: allocate contiguous blocks starting from a given start block\n3. Linked: each block contains data and pointer to next block\n4. Indexed: an index block holds addresses of all data blocks\n5. Display block allocation for each strategy\n6. Stop",
        flowchart: {
          nodes: [
            {
              id: "1",
              type: "start",
              label: "Start",
            },
            {
              id: "2",
              type: "input",
              label: "Read file size, start block",
            },
            {
              id: "3",
              type: "process",
              label: "Sequential: allocate start to start+size-1",
            },
            {
              id: "4",
              type: "process",
              label: "Linked: chain blocks with pointers",
            },
            {
              id: "5",
              type: "process",
              label: "Indexed: create index block with all block addresses",
            },
            {
              id: "6",
              type: "output",
              label: "Display all three allocations",
            },
            {
              id: "7",
              type: "end",
              label: "Stop",
            },
          ],
          edges: [
            {
              source: "1",
              target: "2",
            },
            {
              source: "2",
              target: "3",
            },
            {
              source: "3",
              target: "4",
            },
            {
              source: "4",
              target: "5",
            },
            {
              source: "5",
              target: "6",
            },
            {
              source: "6",
              target: "7",
            },
          ],
        },
        starterCode: {
          supportedLanguages: ["c"],
          templates: {
            c: "#include <stdio.h>\n\nvoid sequential(int start, int length) { \n    // Write your code here\n}\n\nvoid linked(int blocks[], int length) { \n    // Write your code here\n}\n\nvoid indexed(int indexBlock, int blocks[], int length) { \n    // Write your code here\n}\n\nint main() {\n    int start = 5, length = 4;\n    int blocks[] = {10, 15, 22, 30};\n    sequential(start, length);\n    linked(blocks, length);\n    indexed(3, blocks, length);\n    return 0;\n}",
          },
        },
        samples: [
          {
            input: "",
            output:
              "\nSequential Allocation:\nFile occupies blocks: 5 6 7 8 \n\nLinked Allocation:\nBlock 10 -> Block 15\nBlock 15 -> Block 22\nBlock 22 -> Block 30\nBlock 30 -> NULL\n\nIndexed Allocation:\nIndex Block: 3\nData Blocks: 10 15 22 30 \n",
          },
        ],
      },
    ],
  },
  {
    _id: new ObjectId("685b2a1f3c4e8d0012a7b412"),
    subjectId: new ObjectId("685b2a1f3c4e8d0012a7b001"),
    experimentNumber: 14,
    subExperiments: [
      {
        title: "Multi-Level Directory Structure",
        problemStatement:
          "Write a C program to simulate file organization of multi-level directory structure.",
        theory:
          "A multi-level directory structure organizes files in a hierarchy of directories and subdirectories, like a tree. Each directory can contain files and other directories. This allows users to organize files logically and avoids name conflicts. In C, this can be simulated using structures with arrays of children and file names.",
        algorithm:
          "1. Start\n2. Define a Directory structure with name, list of files, list of subdirectories\n3. Create root directory\n4. Add subdirectories and files to directories\n5. Display the full directory tree using recursive traversal\n6. Stop",
        flowchart: {
          nodes: [
            {
              id: "1",
              type: "start",
              label: "Start",
            },
            {
              id: "2",
              type: "process",
              label: "Create root directory",
            },
            {
              id: "3",
              type: "process",
              label: "Add subdirectories to root",
            },
            {
              id: "4",
              type: "process",
              label: "Add files to directories",
            },
            {
              id: "5",
              type: "output",
              label: "Display directory tree (recursive)",
            },
            {
              id: "6",
              type: "end",
              label: "Stop",
            },
          ],
          edges: [
            {
              source: "1",
              target: "2",
            },
            {
              source: "2",
              target: "3",
            },
            {
              source: "3",
              target: "4",
            },
            {
              source: "4",
              target: "5",
            },
            {
              source: "5",
              target: "6",
            },
          ],
        },
        starterCode: {
          supportedLanguages: ["c"],
          templates: {
            c: "#include <stdio.h>\n\nvoid simulateDirectory() {\n    // Write your code here\n}\n\nint main() {\n    simulateDirectory();\n    return 0;\n}",
          },
        },
        samples: [
          {
            input: "",
            output:
              "|-- root/\n  |-- config.sys\n  |-- home/\n    |-- user/\n      |-- resume.pdf\n      |-- notes.txt\n",
          },
        ],
      },
    ],
  },
  {
    _id: new ObjectId("685b2a1f3c4e8d0012a7b413"),
    subjectId: new ObjectId("685b2a1f3c4e8d0012a7b001"),
    experimentNumber: 15,
    subExperiments: [
      {
        title: "Disk Scheduling",
        problemStatement:
          "Write a program in C to do disk scheduling - FCFS, SCAN, C-SCAN.",
        theory:
          "Disk scheduling algorithms determine the order in which disk I/O requests are serviced. FCFS services requests in arrival order — simple but inefficient. SCAN moves the disk head in one direction servicing requests, then reverses — like an elevator. C-SCAN (Circular SCAN) moves in one direction only and jumps back to the start, providing more uniform wait times.",
        algorithm:
          "1. Start\n2. Read disk requests queue and initial head position\n3. FCFS: service requests in order, sum absolute differences\n4. SCAN: sort requests, move head in one direction then reverse\n5. C-SCAN: sort requests, move in one direction, jump to start and continue\n6. Display total head movement for each algorithm\n7. Stop",
        flowchart: {
          nodes: [
            {
              id: "1",
              type: "start",
              label: "Start",
            },
            {
              id: "2",
              type: "input",
              label: "Read requests[], head",
            },
            {
              id: "3",
              type: "process",
              label: "FCFS: sum |requests[i] - prev|",
            },
            {
              id: "4",
              type: "process",
              label: "SCAN: sort, move up then down",
            },
            {
              id: "5",
              type: "process",
              label: "C-SCAN: sort, move up, jump to 0, continue",
            },
            {
              id: "6",
              type: "output",
              label: "Display total movements",
            },
            {
              id: "7",
              type: "end",
              label: "Stop",
            },
          ],
          edges: [
            {
              source: "1",
              target: "2",
            },
            {
              source: "2",
              target: "3",
            },
            {
              source: "3",
              target: "4",
            },
            {
              source: "4",
              target: "5",
            },
            {
              source: "5",
              target: "6",
            },
            {
              source: "6",
              target: "7",
            },
          ],
        },
        starterCode: {
          supportedLanguages: ["c"],
          templates: {
            c: '#include <stdio.h>\n\nvoid fcfs(int req[], int n, int head) { \n    // Write your code here\n}\n\nvoid scan(int req[], int n, int head, int diskSize) { \n    // Write your code here\n}\n\nvoid cscan(int req[], int n, int head, int diskSize) { \n    // Write your code here\n}\n\nint main() {\n    int n, head, diskSize;\n    scanf("%d %d %d", &n, &head, &diskSize);\n    int req[n];\n    for (int i = 0; i < n; i++) scanf("%d", &req[i]);\n    fcfs(req, n, head);\n    // Assume scan and cscan are called appropriately\n    return 0;\n}',
          },
        },
        samples: [
          {
            input: "8 53 200\n98 183 37 122 14 124 65 67",
            output:
              "\nFCFS Order: 53 -> 98 -> 183 -> 37 -> 122 -> 14 -> 124 -> 65 -> 67\nTotal Head Movement: 640\n",
          },
        ],
      },
    ],
  },
];

const seedDB = async () => {
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/bh_labs";
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB for seeding...");

    // Only removes OS data
    await Subject.deleteMany({ code: "VSEC202" });
    await Experiment.deleteMany({
      subjectId: new ObjectId("685b2a1f3c4e8d0012a7b003"),
    });
    console.log("Cleared existing Python data.");

    await Subject.insertMany(subjects);
    console.log("Seeded", subjects.length, "subjects.");
    await Experiment.insertMany(experiments);
    console.log("Seeded", experiments.length, "experiments.");

    console.log("Database seeded successfully!");
  } catch (err) {
    console.error("Seeding error:", err);
  } finally {
    await mongoose.connection.close();
    console.log("Connection closed.");
  }
};

seedDB();
