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
    _id: new ObjectId("685b2a1f3c4e8d0012a7b001"),
    name: "Operating System",
    code: "2114113",
    semester: 4,
    description:
      "This subject covers practical OS experiments including process management, CPU scheduling, synchronization, memory management, file allocation, and disk scheduling.",
  },
];

// ─── Experiments ──────────────────────────────────────────────────────────────
const experiments = [
 
  // ── Exp 4: Child Process ───────────────────────────────────────────────────
  {
    _id: new ObjectId("685b2a1f3c4e8d0012a7b402"),
    subjectId: new ObjectId("685b2a1f3c4e8d0012a7b001"),
    experimentNumber: 4,
    problemStatement:
      "Create a child process in Linux using the fork system call. From the child process obtain the process ID of both child and parent by using getpid and getppid system call.",
    subExperiments: [
      {
        part: "a",
        title: "Child Process using Fork",
        concepts: ["Multiprocessing", "System Calls", "Process IDs"],
        hints: [
          "Use fork() to duplicate the calling process.",
          "Check the return value: 0 indicates the child process.",
          "Use getpid() and getppid() to obtain PIDs.",
        ],
        difficulty: "Medium",
        problemStatement:
          "Create a child process in Linux using the fork system call. From the child process obtain the process ID of both child and parent by using getpid and getppid system call.",
        theory:
          "fork() creates a new child process by duplicating the calling process. It returns 0 in the child process and the child's PID in the parent. getpid() returns the current process ID and getppid() returns the parent process ID. Both parent and child execute concurrently after the fork.",
        algorithm:
          "1. Start\n2. Call fork() to create child process\n3. If fork() returns 0, we are in child process\n4. Child: print getpid() and getppid()\n5. If fork() > 0, we are in parent process\n6. Parent: print getpid()\n7. Stop",
        flowchart: {
          nodes: [
            { id: "1", type: "start", label: "Start" },
            { id: "2", type: "process", label: "pid = fork()" },
            { id: "3", type: "decision", label: "pid == 0?" },
            { id: "4", type: "output", label: "Child: print getpid(), getppid()" },
            { id: "5", type: "output", label: "Parent: print getpid()" },
            { id: "6", type: "end", label: "Stop" },
          ],
          edges: [
            { source: "1", target: "2" },
            { source: "2", target: "3" },
            { source: "3", target: "4", label: "Yes (Child)" },
            { source: "3", target: "5", label: "No (Parent)" },
            { source: "4", target: "6" },
            { source: "5", target: "6" },
          ],
        },
        referenceSolution: {
          c: '#include <stdio.h>\n#include <unistd.h>\n#include <sys/types.h>\n#include <sys/wait.h>\n\nint main() {\n    pid_t pid = fork();\n\n    if (pid < 0) {\n        perror("fork failed");\n        return 1;\n    } else if (pid == 0) {\n        printf("Child Process:\\n  Child PID: %d\\n  Parent PID: %d\\n", getpid(), getppid());\n    } else {\n        wait(NULL);\n        printf("Parent Process:\\n  Parent PID: %d\\n  Child PID: %d\\n", getpid(), pid);\n    }\n\n    return 0;\n}',
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

  // ── Exp 5: Non-Preemptive Scheduling ───────────────────────────────────────
  {
    _id: new ObjectId("685b2a1f3c4e8d0012a7b403"),
    subjectId: new ObjectId("685b2a1f3c4e8d0012a7b001"),
    experimentNumber: 5,
    problemStatement:
      "Write a program to demonstrate the concept of non-preemptive scheduling algorithms (any one).",
    subExperiments: [
      {
        part: "a",
        title: "Non-Preemptive Scheduling",
        concepts: ["CPU Scheduling", "FCFS", "Waiting Time", "Turnaround Time"],
        hints: [
          "Sort processes based on arrival time.",
          "Compute finish time for each process sequentially.",
          "TAT = Finish Time - Arrival Time; WT = TAT - Burst Time.",
        ],
        difficulty: "Medium",
        problemStatement:
          "Write a program to demonstrate the concept of non-preemptive scheduling algorithms (FCFS).",
        theory:
          "In non-preemptive scheduling, once a process is given the CPU, it runs to completion. FCFS (First Come First Serve) schedules processes in the order they arrive. SJF (Shortest Job First) picks the process with the smallest burst time. Both are non-preemptive and simple to implement but can cause convoy effect (FCFS) or starvation (SJF).",
        algorithm:
          "1. Start\n2. Read n processes with arrival time and burst time\n3. Sort by arrival time (FCFS)\n4. Calculate start time, finish time, turnaround time, waiting time for each process\n5. Turnaround time = finish time - arrival time\n6. Waiting time = turnaround time - burst time\n7. Display results table\n8. Stop",
        flowchart: {
          nodes: [
            { id: "1", type: "start", label: "Start" },
            { id: "2", type: "input", label: "Read n, arrival[], burst[]" },
            { id: "3", type: "process", label: "Sort by arrival time" },
            { id: "4", type: "process", label: "i = 0, time = 0" },
            { id: "5", type: "decision", label: "i < n?" },
            { id: "6", type: "process", label: "start = max(time, arrival[i])" },
            { id: "7", type: "process", label: "finish = start + burst[i]" },
            { id: "8", type: "process", label: "tat = finish - arrival[i], wt = tat - burst[i]" },
            { id: "9", type: "process", label: "time = finish, i++" },
            { id: "10", type: "output", label: "Display results" },
            { id: "11", type: "end", label: "Stop" },
          ],
          edges: [
            { source: "1", target: "2" },
            { source: "2", target: "3" },
            { source: "3", target: "4" },
            { source: "4", target: "5" },
            { source: "5", target: "6", label: "Yes" },
            { source: "6", target: "7" },
            { source: "7", target: "8" },
            { source: "8", target: "9" },
            { source: "9", target: "5" },
            { source: "5", target: "10", label: "No" },
            { source: "10", target: "11" },
          ],
        },
        referenceSolution: {
          c: '#include <stdio.h>\n\nint main() {\n    int n;\n    if (scanf("%d", &n) != 1) return 0;\n    int arrival[n], burst[n];\n    for (int i = 0; i < n; i++) {\n        scanf("%d %d", &arrival[i], &burst[i]);\n    }\n    int finish[n], tat[n], wt[n];\n    int time = 0;\n    int col;\n    for (int i = 0; i < n; i++) {\n        if (time < arrival[i]) {\n            time = arrival[i];\n        }\n        finish[i] = time + burst[i];\n        tat[i] = finish[i] - arrival[i];\n        col = tat[i] - burst[i];\n        wt[i] = col;\n        time = finish[i];\n    }\n    printf("\\nProcess | Arrival | Burst | Finish | TAT | WT\\n");\n    for (int i = 0; i < n; i++) {\n        printf("P%d      | %d       | %d     | %d      | %d   | %d\\n", i + 1, arrival[i], burst[i], finish[i], tat[i], wt[i]);\n    }\n    return 0;\n}',
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

  // ── Exp 6: Preemptive Scheduling ───────────────────────────────────────────
  {
    _id: new ObjectId("685b2a1f3c4e8d0012a7b404"),
    subjectId: new ObjectId("685b2a1f3c4e8d0012a7b001"),
    experimentNumber: 6,
    problemStatement:
      "Write a program to demonstrate the concept of preemptive scheduling algorithms (any one).",
    subExperiments: [
      {
        part: "a",
        title: "Preemptive Scheduling",
        concepts: ["CPU Scheduling", "Round Robin", "Preemption", "Time Quantum"],
        hints: [
          "Use a queue to manage ready processes.",
          "Execute a process for up to one time quantum.",
          "Check for newly arrived processes during execution.",
        ],
        difficulty: "Hard",
        problemStatement:
          "Write a program to demonstrate the concept of preemptive scheduling algorithms (Round Robin).",
        theory:
          "In preemptive scheduling, a running process can be interrupted and replaced by another. Round Robin assigns a fixed time quantum to each process in order. SRTF (Shortest Remaining Time First) preempts the current process if a new process arrives with a shorter remaining burst time. These algorithms improve response time and fairness.",
        algorithm:
          "1. Start\n2. Read n processes with arrival time and burst time\n3. Read time quantum q\n4. Use a queue and simulate Round Robin\n5. At each time unit, check if process quantum is exhausted\n6. If yes, move to next process in queue\n7. Calculate TAT and WT for each process\n8. Display results\n9. Stop",
        flowchart: {
          nodes: [
            { id: "1", type: "start", label: "Start" },
            { id: "2", type: "input", label: "Read n, arrival[], burst[], quantum" },
            { id: "3", type: "process", label: "Initialize remaining[] = burst[]" },
            { id: "4", type: "process", label: "time = 0, completed = 0" },
            { id: "5", type: "decision", label: "completed < n?" },
            { id: "6", type: "process", label: "Execute process for min(remaining, quantum)" },
            { id: "7", type: "process", label: "Update remaining, time" },
            { id: "8", type: "decision", label: "remaining == 0?" },
            { id: "9", type: "process", label: "Record finish time, completed++" },
            { id: "10", type: "output", label: "Display TAT, WT" },
            { id: "11", type: "end", label: "Stop" },
          ],
          edges: [
            { source: "1", target: "2" },
            { source: "2", target: "3" },
            { source: "3", target: "4" },
            { source: "4", target: "5" },
            { source: "5", target: "6", label: "Yes" },
            { source: "6", target: "7" },
            { source: "7", target: "8" },
            { source: "8", target: "9", label: "Yes" },
            { source: "8", target: "5", label: "No" },
            { source: "9", target: "5" },
            { source: "5", target: "10", label: "No" },
            { source: "10", target: "11" },
          ],
        },
        referenceSolution: {
          c: '#include <stdio.h>\n\nstruct Process {\n    int id, arrival, burst, rem, finish, tat, wt;\n};\n\nint main() {\n    int n, q;\n    if (scanf("%d %d", &n, &q) != 2) return 0;\n    struct Process p[n];\n    for (int i = 0; i < n; i++) {\n        p[i].id = i + 1;\n        scanf("%d %d", &p[i].arrival, &p[i].burst);\n        p[i].rem = p[i].burst;\n    }\n    int time = 0, completed = 0;\n    int queue[1000], front = 0, rear = 0;\n    int inQueue[1000] = {0};\n    for (int i = 0; i < n; i++) {\n        if (p[i].arrival <= time) {\n            queue[rear++] = i;\n            inQueue[i] = 1;\n        }\n    }\n    while (completed < n) {\n        if (front == rear) {\n            int nextArrival = 999999;\n            for (int i = 0; i < n; i++) {\n                if (p[i].rem > 0 && p[i].arrival < nextArrival) {\n                    nextArrival = p[i].arrival;\n                }\n            }\n            time = nextArrival;\n            for (int i = 0; i < n; i++) {\n                if (p[i].rem > 0 && p[i].arrival <= time && !inQueue[i]) {\n                    queue[rear++] = i;\n                    inQueue[i] = 1;\n                }\n            }\n        }\n        int curr = queue[front++];\n        int execTime = (p[curr].rem < q) ? p[curr].rem : q;\n        p[curr].rem -= execTime;\n        time += execTime;\n        for (int i = 0; i < n; i++) {\n            if (p[i].rem > 0 && p[i].arrival <= time && !inQueue[i]) {\n                queue[rear++] = i;\n                inQueue[i] = 1;\n            }\n        }\n        if (p[curr].rem == 0) {\n            p[curr].finish = time;\n            p[curr].tat = p[curr].finish - p[curr].arrival;\n            p[curr].wt = p[curr].tat - p[curr].burst;\n            completed++;\n        } else {\n            queue[rear++] = curr;\n        }\n    }\n    printf("\\nProcess | Arrival | Burst | Finish | TAT | WT\\n");\n    for (int i = 0; i < n; i++) {\n        printf("P%d      | %d       | %d     | %d     | %d  | %d\\n", p[i].id, p[i].arrival, p[i].burst, p[i].finish, p[i].tat, p[i].wt);\n    }\n    return 0;\n}',
        },
        samples: [
          {
            input: "3 2\n0 5\n1 3\n2 8",
            output:
              "\nProcess | Arrival | Burst | Finish | TAT | WT\nP1      | 0       | 5     | 10     | 10  | 5\nP2      | 1       | 3     | 9      | 8   | 5\nP3      | 2       | 8     | 16     | 14  | 6\n",
          },
        ],
      },
    ],
  },

  // ── Exp 7: Producer Consumer Problem ───────────────────────────────────────
  {
    _id: new ObjectId("685b2a1f3c4e8d0012a7b405"),
    subjectId: new ObjectId("685b2a1f3c4e8d0012a7b001"),
    experimentNumber: 7,
    problemStatement:
      "Write a C program to implement solution of Producer Consumer problem through Semaphore.",
    subExperiments: [
      {
        part: "a",
        title: "Producer Consumer Problem",
        concepts: ["Process Synchronization", "Semaphores", "Mutex Locks"],
        hints: [
          "Use empty semaphore initialized to buffer size.",
          "Use full semaphore initialized to 0.",
          "Protect critical section with a mutex lock.",
        ],
        difficulty: "Medium",
        problemStatement:
          "Write a C program to implement solution of Producer Consumer problem through Semaphore.",
        theory:
          "The Producer-Consumer problem is a classic synchronization problem. A producer generates data and puts it in a buffer; a consumer takes data from the buffer. Semaphores control access: 'empty' counts empty slots, 'full' counts filled slots, and 'mutex' ensures mutual exclusion. sem_wait() decrements and sem_post() increments a semaphore.",
        algorithm:
          "1. Start\n2. Initialize semaphores: empty = BUFFER_SIZE, full = 0, mutex = 1\n3. Producer: sem_wait(empty), sem_wait(mutex), produce item, sem_post(mutex), sem_post(full)\n4. Consumer: sem_wait(full), sem_wait(mutex), consume item, sem_post(mutex), sem_post(empty)\n5. Run producer and consumer as threads\n6. Stop",
        flowchart: {
          nodes: [
            { id: "1", type: "start", label: "Start" },
            { id: "2", type: "process", label: "Init: empty=N, full=0, mutex=1" },
            { id: "3", type: "process", label: "Producer: sem_wait(empty)" },
            { id: "4", type: "process", label: "sem_wait(mutex)" },
            { id: "5", type: "process", label: "Add item to buffer" },
            { id: "6", type: "process", label: "sem_post(mutex), sem_post(full)" },
            { id: "7", type: "process", label: "Consumer: sem_wait(full)" },
            { id: "8", type: "process", label: "sem_wait(mutex)" },
            { id: "9", type: "process", label: "Remove item from buffer" },
            { id: "10", type: "process", label: "sem_post(mutex), sem_post(empty)" },
            { id: "11", type: "end", label: "Stop" },
          ],
          edges: [
            { source: "1", target: "2" },
            { source: "2", target: "3" },
            { source: "3", target: "4" },
            { source: "4", target: "5" },
            { source: "5", target: "6" },
            { source: "6", target: "7" },
            { source: "7", target: "8" },
            { source: "8", target: "9" },
            { source: "9", target: "10" },
            { source: "10", target: "11" },
          ],
        },
        referenceSolution: {
          c: '#include <stdio.h>\n#include <pthread.h>\n#include <semaphore.h>\n#include <unistd.h>\n\n#define BUFFER_SIZE 5\nint buffer[BUFFER_SIZE];\nint in = 0, out = 0;\nsem_t empty;\nsem_t full;\npthread_mutex_t mutex;\n\nvoid* producer(void* arg) {\n    for (int i = 0; i < 2; i++) {\n        sem_wait(&empty);\n        pthread_mutex_lock(&mutex);\n        buffer[in] = i;\n        printf("Produced: %d\\n", buffer[in]);\n        in = (in + 1) % BUFFER_SIZE;\n        pthread_mutex_unlock(&mutex);\n        sem_post(&full);\n        usleep(10000);\n    }\n    return NULL;\n}\n\nvoid* consumer(void* arg) {\n    for (int i = 0; i < 2; i++) {\n        sem_wait(&full);\n        pthread_mutex_lock(&mutex);\n        int item = buffer[out];\n        printf("Consumed: %d\\n", item);\n        out = (out + 1) % BUFFER_SIZE;\n        pthread_mutex_unlock(&mutex);\n        sem_post(&empty);\n        usleep(10000);\n    }\n    return NULL;\n}\n\nint main() {\n    pthread_t prod, cons;\n    sem_init(&empty, 0, BUFFER_SIZE);\n    sem_init(&full, 0, 0);\n    pthread_mutex_init(&mutex, NULL);\n    pthread_create(&prod, NULL, producer, NULL);\n    pthread_create(&cons, NULL, consumer, NULL);\n    pthread_join(prod, NULL);\n    pthread_join(cons, NULL);\n    sem_destroy(&empty);\n    sem_destroy(&full);\n    pthread_mutex_destroy(&mutex);\n    return 0;\n}',
        },
        samples: [
          {
            input: "",
            output: "Produced: 0\nConsumed: 0\nProduced: 1\nConsumed: 1\n",
          },
        ],
      },
    ],
  },

  // ── Exp 8: Banker's Algorithm ──────────────────────────────────────────────
  {
    _id: new ObjectId("685b2a1f3c4e8d0012a7b406"),
    subjectId: new ObjectId("685b2a1f3c4e8d0012a7b001"),
    experimentNumber: 8,
    problemStatement:
      "Write a program to demonstrate the concept of deadlock avoidance through Banker's Algorithm.",
    subExperiments: [
      {
        part: "a",
        title: "Banker's Algorithm",
        concepts: ["Deadlock Avoidance", "Safe State", "Resource Allocation"],
        hints: [
          "Compute the Need matrix as Max - Allocation.",
          "Maintain a Work vector initialized to Available.",
          "Check which processes can finish, update Work, and track safety.",
        ],
        difficulty: "Hard",
        problemStatement:
          "Write a program to demonstrate the concept of deadlock avoidance through Banker's Algorithm.",
        theory:
          "Banker's Algorithm is a deadlock avoidance algorithm. It checks whether granting a resource request will leave the system in a safe state. A safe state means there exists a sequence of processes that can all complete. It uses the Need matrix (Max - Allocation), Available resources, and simulates process execution to find a safe sequence.",
        algorithm:
          "1. Start\n2. Read n processes, m resources, Allocation matrix, Max matrix, Available vector\n3. Calculate Need = Max - Allocation\n4. Initialize Finish[] = false, Work[] = Available\n5. Find a process i where Finish[i] == false and Need[i] <= Work\n6. If found: Work += Allocation[i], Finish[i] = true, add to safe sequence\n7. Repeat until all processes finish or no process found\n8. If all finish: Safe state, print sequence. Else: Unsafe state\n9. Stop",
        flowchart: {
          nodes: [
            { id: "1", type: "start", label: "Start" },
            { id: "2", type: "input", label: "Read Allocation, Max, Available" },
            { id: "3", type: "process", label: "Need = Max - Allocation" },
            { id: "4", type: "process", label: "Work = Available, Finish[] = false" },
            { id: "5", type: "decision", label: "Find P[i]: !Finish[i] && Need[i]<=Work" },
            { id: "6", type: "process", label: "Work += Alloc[i], Finish[i]=true" },
            { id: "7", type: "decision", label: "All Finish == true?" },
            { id: "8", type: "output", label: "Safe State: print sequence" },
            { id: "9", type: "output", label: "Unsafe State" },
            { id: "10", type: "end", label: "Stop" },
          ],
          edges: [
            { source: "1", target: "2" },
            { source: "2", target: "3" },
            { source: "3", target: "4" },
            { source: "4", target: "5" },
            { source: "5", target: "6", label: "Found" },
            { source: "6", target: "5" },
            { source: "5", target: "7", label: "Not Found" },
            { source: "7", target: "8", label: "Yes" },
            { source: "7", target: "9", label: "No" },
            { source: "8", target: "10" },
            { source: "9", target: "10" },
          ],
        },
        referenceSolution: {
          c: '#include <stdio.h>\n#include <stdbool.h>\n\nint main() {\n    int n, m;\n    if (scanf("%d %d", &n, &m) != 2) return 0;\n    int alloc[n][m], max[n][m], need[n][m], avail[m];\n    for (int i = 0; i < n; i++)\n        for (int j = 0; j < m; j++)\n            scanf("%d", &alloc[i][j]);\n    for (int i = 0; i < n; i++)\n        for (int j = 0; j < m; j++) {\n            scanf("%d", &max[i][j]);\n            need[i][j] = max[i][j] - alloc[i][j];\n        }\n    for (int j = 0; j < m; j++) scanf("%d", &avail[j]);\n    bool finish[n];\n    int safeSeq[n], count = 0;\n    for (int i = 0; i < n; i++) finish[i] = false;\n    while (count < n) {\n        bool found = false;\n        for (int i = 0; i < n; i++) {\n            if (!finish[i]) {\n                int j;\n                for (j = 0; j < m; j++)\n                    if (need[i][j] > avail[j]) break;\n                if (j == m) {\n                    for (int k = 0; k < m; k++) avail[k] += alloc[i][k];\n                    safeSeq[count++] = i;\n                    finish[i] = true;\n                    found = true;\n                }\n            }\n        }\n        if (!found) {\n            printf("System is not in a safe state.\\n");\n            return 0;\n        }\n    }\n    printf("Safe Sequence: ");\n    for (int i = 0; i < n; i++) {\n        printf("P%d", safeSeq[i]);\n        if (i < n - 1) printf(" -> ");\n    }\n    printf("\\n");\n    return 0;\n}',
        },
        samples: [
          {
            input: "5 3\n0 1 0\n2 0 0\n3 0 2\n2 1 1\n0 0 2\n7 5 3\n3 2 2\n9 0 2\n2 2 2\n4 3 3\n3 3 2",
            output: "Safe Sequence:  P1 -> P3 -> P4 -> P0 -> P2\n",
          },
        ],
      },
    ],
  },

  // ── Exp 9: Memory Management ───────────────────────────────────────────────
  {
    _id: new ObjectId("685b2a1f3c4e8d0012a7b407"),
    subjectId: new ObjectId("685b2a1f3c4e8d0012a7b001"),
    experimentNumber: 9,
    problemStatement:
      "Write a program to demonstrate the concept of MVT and MFT memory management techniques.",
    subExperiments: [
      {
        part: "a",
        title: "MVT and MFT Memory Management",
        concepts: ["Memory Management", "MFT", "MVT", "Fragmentation"],
        hints: [
          "MFT uses fixed size partitions; compute internal fragmentation.",
          "MVT allocates dynamic memory exactly as requested.",
          "Track remaining memory and report allocation failures.",
        ],
        difficulty: "Hard",
        problemStatement:
          "Write a program to demonstrate the concept of MVT and MFT memory management techniques.",
        theory:
          "MFT (Multiprogramming with Fixed number of Tasks) divides memory into fixed-size partitions. Each process is loaded into a partition. Internal fragmentation occurs when a process is smaller than the partition. MVT (Multiprogramming with Variable number of Tasks) allocates exactly the memory needed by each process. External fragmentation can occur as free holes form between allocated blocks.",
        algorithm:
          "1. Start\n2. For MFT: define fixed partitions, assign processes to partitions, show internal fragmentation\n3. For MVT: maintain a free memory list, allocate exact memory for each process, show external fragmentation\n4. Display memory layout after each allocation\n5. Stop",
        flowchart: {
          nodes: [
            { id: "1", type: "start", label: "Start" },
            { id: "2", type: "input", label: "Read total memory, partition size (MFT)" },
            { id: "3", type: "process", label: "Create fixed partitions" },
            { id: "4", type: "input", label: "Read process sizes" },
            { id: "5", type: "process", label: "Assign each process to a partition" },
            { id: "6", type: "output", label: "Show partition map and fragmentation" },
            { id: "7", type: "input", label: "Read process sizes (MVT)" },
            { id: "8", type: "process", label: "Allocate exact memory for each" },
            { id: "9", type: "output", label: "Show memory map" },
            { id: "10", type: "end", label: "Stop" },
          ],
          edges: [
            { source: "1", target: "2" },
            { source: "2", target: "3" },
            { source: "3", target: "4" },
            { source: "4", target: "5" },
            { source: "5", target: "6" },
            { source: "6", target: "7" },
            { source: "7", target: "8" },
            { source: "8", target: "9" },
            { source: "9", target: "10" },
          ],
        },
        referenceSolution: {
          c: '#include <stdio.h>\n\nint main() {\n    int n, totalMem, pSize;\n    if (scanf("%d %d %d", &n, &totalMem, &pSize) != 3) return 0;\n    int proc[n];\n    for (int i = 0; i < n; i++) scanf("%d", &proc[i]);\n    printf("\\n--- MFT ---\\n");\n    printf("Partition Size: %d KB\\n", pSize);\n    int partCount = totalMem / pSize;\n    int usedParts = 0;\n    for (int i = 0; i < n; i++) {\n        if (usedParts < partCount) {\n            if (proc[i] <= pSize) {\n                printf("P%d (%d KB) -> Partition %d | Internal Frag: %d KB\\n", i + 1, proc[i], usedParts + 1, pSize - proc[i]);\n                usedParts++;\n            } else {\n                printf("P%d (%d KB) -> Block size exceeded\\n", i + 1, proc[i]);\n            }\n        } else {\n            printf("P%d (%d KB) -> Memory full\\n", i + 1, proc[i]);\n        }\n    }\n    return 0;\n}',
        },
        samples: [
          {
            input: "4 1024 256\n200 150 300 100",
            output:
              "\n--- MFT ---\nPartition Size: 256 KB\nP1 (200 KB) -> Partition 1 | Internal Frag: 56 KB\nP2 (150 KB) -> Partition 2 | Internal Frag: 106 KB\nP3 (300 KB) -> Block size exceeded\nP4 (100 KB) -> Partition 3 | Internal Frag: 156 KB\n",
          },
        ],
      },
    ],
  },

  // ── Exp 10: Dynamic Partitioning ───────────────────────────────────────────
  {
    _id: new ObjectId("685b2a1f3c4e8d0012a7b408"),
    subjectId: new ObjectId("685b2a1f3c4e8d0012a7b001"),
    experimentNumber: 10,
    problemStatement:
      "Write a program to demonstrate the concept of dynamic partitioning placement algorithms i.e. Best Fit, First Fit, Worst-Fit etc.",
    subExperiments: [
      {
        part: "a",
        title: "Dynamic Partitioning",
        concepts: ["Dynamic Partitioning", "Placement Algorithms", "First Fit"],
        hints: [
          "Loop through each process.",
          "Check memory blocks sequentially from the start.",
          "Assign to the first block that has size >= process size.",
        ],
        difficulty: "Hard",
        problemStatement:
          "Write a program to demonstrate the concept of dynamic partitioning placement algorithms (First Fit).",
        theory:
          "Dynamic partitioning allocates memory based on process size. First Fit allocates the first hole that is large enough. Best Fit allocates the smallest hole that fits the process, minimizing wasted space. Worst Fit allocates the largest hole, leaving large remaining fragments. All three scan the free memory list differently.",
        algorithm:
          "1. Start\n2. Read memory blocks and process sizes\n3. First Fit: scan from start, allocate first block >= process size\n4. Best Fit: scan all, allocate smallest block >= process size\n5. Worst Fit: scan all, allocate largest block >= process size\n6. Display allocation results for each algorithm\n7. Stop",
        flowchart: {
          nodes: [
            { id: "1", type: "start", label: "Start" },
            { id: "2", type: "input", label: "Read blocks[], processes[]" },
            { id: "3", type: "process", label: "First Fit: find first block >= process" },
            { id: "4", type: "process", label: "Best Fit: find smallest block >= process" },
            { id: "5", type: "process", label: "Worst Fit: find largest block >= process" },
            { id: "6", type: "output", label: "Display allocation table" },
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
          c: '#include <stdio.h>\n\nint main() {\n    int blocks[] = {100, 500, 200, 300, 600};\n    int processes[] = {212, 417, 112, 426};\n    int m = 5, n = 4;\n    int allocation[4];\n    for (int i = 0; i < n; i++) allocation[i] = -1;\n    int bCopy[5];\n    for (int i = 0; i < m; i++) bCopy[i] = blocks[i];\n    for (int i = 0; i < n; i++) {\n        for (int j = 0; j < m; j++) {\n            if (bCopy[j] >= processes[i]) {\n                allocation[i] = j;\n                bCopy[j] -= processes[i];\n                break;\n            }\n        }\n    }\n    printf("\\nFirst Fit:\\nProcess\\tSize\\tBlock\\n");\n    for (int i = 0; i < n; i++) {\n        if (allocation[i] != -1)\n            printf("P%d\\t%d\\t%d\\n", i + 1, processes[i], allocation[i] + 1);\n        else\n            printf("P%d\\t%d\\t-1\\n", i + 1, processes[i]);\n    }\n    return 0;\n}',
        },
        samples: [
          {
            input: "",
            output: "\nFirst Fit:\nProcess\tSize\tBlock\nP1\t212\t2\nP2\t417\t5\nP3\t112\t2\nP4\t426\t-1\n",
          },
        ],
      },
    ],
  },

  // ── Exp 11: Demand Paging ──────────────────────────────────────────────────
  {
    _id: new ObjectId("685b2a1f3c4e8d0012a7b409"),
    subjectId: new ObjectId("685b2a1f3c4e8d0012a7b001"),
    experimentNumber: 11,
    problemStatement:
      "Write a program to demonstrate the concept of demand paging for simulation of Virtual Memory implementation.",
    subExperiments: [
      {
        part: "a",
        title: "Virtual Memory / Demand Paging",
        concepts: ["Virtual Memory", "Demand Paging", "Page Faults", "LRU"],
        hints: [
          "Maintain a frame list initialized to empty (-1).",
          "Track the index/time of last usage for LRU replacement.",
          "Increment and display the page fault count when page not found.",
        ],
        difficulty: "Hard",
        problemStatement:
          "Write a program to demonstrate the concept of demand paging for simulation of Virtual Memory implementation (LRU).",
        theory:
          "Demand paging loads pages into memory only when they are needed. When a page is not in memory, a page fault occurs and the OS loads the page from disk. A page table tracks which pages are in memory. This allows programs larger than physical memory to run by using disk as an extension of RAM.",
        algorithm:
          "1. Start\n2. Read page reference string and number of frames\n3. Initialize all frames as empty (-1)\n4. For each page in reference string:\n5. Check if page is already in a frame (no page fault)\n6. If not, page fault occurs: load page into a free frame or replace using a policy\n7. Count total page faults\n8. Display frame state after each reference\n9. Stop",
        flowchart: {
          nodes: [
            { id: "1", type: "start", label: "Start" },
            { id: "2", type: "input", label: "Read pages[], frames count" },
            { id: "3", type: "process", label: "Initialize frames[] = -1, faults = 0" },
            { id: "4", type: "process", label: "i = 0" },
            { id: "5", type: "decision", label: "i < page count?" },
            { id: "6", type: "decision", label: "Page in frames?" },
            { id: "7", type: "process", label: "Page fault: load page, faults++" },
            { id: "8", type: "output", label: "Display frame state" },
            { id: "9", type: "process", label: "i++" },
            { id: "10", type: "output", label: "Print total faults" },
            { id: "11", type: "end", label: "Stop" },
          ],
          edges: [
            { source: "1", target: "2" },
            { source: "2", target: "3" },
            { source: "3", target: "4" },
            { source: "4", target: "5" },
            { source: "5", target: "6", label: "Yes" },
            { source: "6", target: "7", label: "No (Page Fault)" },
            { source: "6", target: "8", label: "Yes (Hit)" },
            { source: "7", target: "8" },
            { source: "8", target: "9" },
            { source: "9", target: "5" },
            { source: "5", target: "10", label: "No" },
            { source: "10", target: "11" },
          ],
        },
        referenceSolution: {
          c: '#include <stdio.h>\n\nint main() {\n    int frames, n;\n    if (scanf("%d %d", &frames, &n) != 2) return 0;\n    int pages[n];\n    for (int i = 0; i < n; i++) scanf("%d", &pages[i]);\n    int fr[frames], recent[frames];\n    for (int i = 0; i < frames; i++) { fr[i] = -1; recent[i] = -1; }\n    int faults = 0;\n    printf("\\nPage\\tFrames\\t\\t\\tFault\\n");\n    for (int i = 0; i < n; i++) {\n        int page = pages[i];\n        int hit = 0;\n        for (int j = 0; j < frames; j++) {\n            if (fr[j] == page) {\n                hit = 1; recent[j] = i; break;\n            }\n        }\n        char faultChar = \' \';\n        if (!hit) {\n            int repIdx = 0, minRecent = i + 1;\n            for (int j = 0; j < frames; j++) {\n                if (fr[j] == -1) { repIdx = j; break; }\n                if (recent[j] < minRecent) { minRecent = recent[j]; repIdx = j; }\n            }\n            fr[repIdx] = page;\n            recent[repIdx] = i;\n            faults++;\n            faultChar = \'*\';\n        }\n        printf("%d\\t", page);\n        for (int j = 0; j < frames; j++) printf("%d ", fr[j]);\n        printf("\\t%c\\n", faultChar);\n    }\n    printf("Total Page Faults: %d\\n", faults);\n    return 0;\n}',
        },
        samples: [
          {
            input: "3 13\n7 0 1 2 0 3 0 4 2 3 0 3 2",
            output:
              "\nPage\tFrames\t\t\tFault\n7\t7 -1 -1 \t*\n0\t7 0 -1 \t*\n1\t7 0 1 \t*\n2\t2 0 1 \t*\n0\t2 0 1 \t \n3\t2 3 1 \t*\n0\t2 3 0 \t*\n4\t4 3 0 \t*\n2\t4 2 0 \t*\n3\t4 2 3 \t*\n0\t0 2 3 \t*\n3\t0 2 3 \t \n2\t0 2 3 \t \nTotal Page Faults: 9\n",
          },
        ],
      },
    ],
  },

  // ── Exp 12: Page Replacement Policies ──────────────────────────────────────
  {
    _id: new ObjectId("685b2a1f3c4e8d0012a7b410"),
    subjectId: new ObjectId("685b2a1f3c4e8d0012a7b001"),
    experimentNumber: 12,
    problemStatement:
      "Write a program in C to demonstrate the concept of page replacement policies for handling page faults eg: FIFO, LRU etc.",
    subExperiments: [
      {
        part: "a",
        title: "Page Replacement Policies",
        concepts: ["Virtual Memory", "Page Replacement", "FIFO", "LRU"],
        hints: [
          "For FIFO, use a circular pointer to track insertion order.",
          "For LRU, keep track of when each frame was last accessed.",
          "Compare the results of both algorithms on the same reference string.",
        ],
        difficulty: "Hard",
        problemStatement:
          "Write a program in C to demonstrate the concept of page replacement policies for handling page faults (FIFO, LRU).",
        theory:
          "Page replacement algorithms decide which page to evict when a page fault occurs and frames are full. FIFO removes the oldest loaded page. LRU (Least Recently Used) removes the page not used for the longest time. Optimal replaces the page that will not be used for the longest time in future. LRU generally performs better than FIFO but requires tracking usage history.",
        algorithm:
          "1. Start\n2. Read page reference string and number of frames\n3. FIFO: maintain a queue, replace front when full\n4. LRU: track last used time for each frame, replace least recently used\n5. Count page faults for each algorithm\n6. Display results\n7. Stop",
        flowchart: {
          nodes: [
            { id: "1", type: "start", label: "Start" },
            { id: "2", type: "input", label: "Read pages[], frames" },
            { id: "3", type: "process", label: "Run FIFO, count faults" },
            { id: "4", type: "process", label: "Run LRU, count faults" },
            { id: "5", type: "output", label: "Display FIFO faults, LRU faults" },
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
          c: '#include <stdio.h>\n\nint fifo(int pages[], int n, int frames) {\n    int fr[frames];\n    for (int i = 0; i < frames; i++) fr[i] = -1;\n    int faults = 0, index = 0;\n    for (int i = 0; i < n; i++) {\n        int hit = 0;\n        for (int j = 0; j < frames; j++) {\n            if (fr[j] == pages[i]) { hit = 1; break; }\n        }\n        if (!hit) {\n            fr[index] = pages[i];\n            index = (index + 1) % frames;\n            faults++;\n        }\n    }\n    return faults;\n}\n\nint lru(int pages[], int n, int frames) {\n    int fr[frames], recent[frames];\n    for (int i = 0; i < frames; i++) { fr[i] = -1; recent[i] = -1; }\n    int faults = 0;\n    for (int i = 0; i < n; i++) {\n        int hit = 0;\n        for (int j = 0; j < frames; j++) {\n            if (fr[j] == pages[i]) { hit = 1; recent[j] = i; break; }\n        }\n        if (!hit) {\n            int repIdx = 0, minRecent = i + 1;\n            for (int j = 0; j < frames; j++) {\n                if (fr[j] == -1) { repIdx = j; break; }\n                if (recent[j] < minRecent) { minRecent = recent[j]; repIdx = j; }\n            }\n            fr[repIdx] = pages[i];\n            recent[repIdx] = i;\n            faults++;\n        }\n    }\n    return faults;\n}\n\nint main() {\n    int frames, n;\n    if (scanf("%d %d", &frames, &n) != 2) return 0;\n    int pages[n];\n    for (int i = 0; i < n; i++) scanf("%d", &pages[i]);\n    printf("FIFO Page Faults: %d\\n", fifo(pages, n, frames));\n    printf("LRU Page Faults: %d\\n", lru(pages, n, frames));\n    return 0;\n}',
        },
        samples: [
          {
            input: "3 20\n7 0 1 2 0 3 0 4 2 3 0 3 2 1 2 0 1 7 0 1",
            output: "FIFO Page Faults: 15\nLRU Page Faults: 12\n",
          },
        ],
      },
    ],
  },

  // ── Exp 13: File Allocation ────────────────────────────────────────────────
  {
    _id: new ObjectId("685b2a1f3c4e8d0012a7b411"),
    subjectId: new ObjectId("685b2a1f3c4e8d0012a7b001"),
    experimentNumber: 13,
    problemStatement:
      "Write a C program to simulate File allocation strategies typically sequential, indexed and linked files.",
    subExperiments: [
      {
        part: "a",
        title: "File Allocation Strategies",
        concepts: ["File Allocation", "Sequential", "Linked", "Indexed"],
        hints: [
          "Sequential allocation lists contiguous indexes from a start index.",
          "Linked allocation chains discrete block addresses.",
          "Indexed allocation lists block indexes associated with an index block.",
        ],
        difficulty: "Hard",
        problemStatement:
          "Write a C program to simulate File allocation strategies typically sequential, indexed and linked files.",
        theory:
          "Sequential allocation stores file blocks contiguously on disk — fast access but suffers from external fragmentation. Linked allocation uses pointers in each block to point to the next — no fragmentation but slow random access. Indexed allocation uses an index block that holds pointers to all file blocks — supports direct access and no external fragmentation.",
        algorithm:
          "1. Start\n2. Sequential: allocate contiguous blocks starting from a given start block\n3. Linked: each block contains data and pointer to next block\n4. Indexed: an index block holds addresses of all data blocks\n5. Display block allocation for each strategy\n6. Stop",
        flowchart: {
          nodes: [
            { id: "1", type: "start", label: "Start" },
            { id: "2", type: "input", label: "Read file size, start block" },
            { id: "3", type: "process", label: "Sequential: allocate start to start+size-1" },
            { id: "4", type: "process", label: "Linked: chain blocks with pointers" },
            { id: "5", type: "process", label: "Indexed: create index block with all block addresses" },
            { id: "6", type: "output", label: "Display all three allocations" },
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
          c: '#include <stdio.h>\n\nint main() {\n    int start = 5, length = 4;\n    int blocks[] = {10, 15, 22, 30};\n    printf("\\nSequential Allocation:\\nFile occupies blocks: ");\n    for (int i = 0; i < length; i++) printf("%d ", start + i);\n    printf("\\n\\nLinked Allocation:\\n");\n    for (int i = 0; i < length - 1; i++) {\n        printf("Block %d -> Block %d\\n", blocks[i], blocks[i+1]);\n    }\n    printf("Block %d -> NULL\\n", blocks[length-1]);\n    printf("\\nIndexed Allocation:\\nIndex Block: 3\\nData Blocks: ");\n    for (int i = 0; i < length; i++) printf("%d ", blocks[i]);\n    printf("\\n");\n    return 0;\n}',
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

  // ── Exp 15: Disk Scheduling ────────────────────────────────────────────────
  {
    _id: new ObjectId("685b2a1f3c4e8d0012a7b413"),
    subjectId: new ObjectId("685b2a1f3c4e8d0012a7b001"),
    experimentNumber: 15,
    problemStatement:
      "Write a program in C to do disk scheduling - FCFS, SCAN, C-SCAN.",
    subExperiments: [
      {
        part: "a",
        title: "Disk Scheduling",
        concepts: ["I/O Scheduling", "Disk Scheduling", "FCFS"],
        hints: [
          "Initialize the disk head at the given start track.",
          "Service requests sequentially in the order they arrive.",
          "Compute total head movement by summing absolute track differences.",
        ],
        difficulty: "Hard",
        problemStatement:
          "Write a program in C to do disk scheduling - FCFS.",
        theory:
          "Disk scheduling algorithms determine the order in which disk I/O requests are serviced. FCFS services requests in arrival order — simple but inefficient. SCAN moves the disk head in one direction servicing requests, then reverses — like an elevator. C-SCAN (Circular SCAN) moves in one direction only and jumps back to the start, providing more uniform wait times.",
        algorithm:
          "1. Start\n2. Read disk requests queue and initial head position\n3. FCFS: service requests in order, sum absolute differences\n4. SCAN: sort requests, move head in one direction then reverse\n5. C-SCAN: sort requests, move in one direction, jump to start and continue\n6. Display total head movement for each algorithm\n7. Stop",
        flowchart: {
          nodes: [
            { id: "1", type: "start", label: "Start" },
            { id: "2", type: "input", label: "Read requests[], head" },
            { id: "3", type: "process", label: "FCFS: sum |requests[i] - prev|" },
            { id: "4", type: "process", label: "SCAN: sort, move up then down" },
            { id: "5", type: "process", label: "C-SCAN: sort, move up, jump to 0, continue" },
            { id: "6", type: "output", label: "Display total movements" },
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
          c: '#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    int n, head, diskSize;\n    if (scanf("%d %d %d", &n, &head, &diskSize) != 3) return 0;\n    int req[n];\n    for (int i = 0; i < n; i++) scanf("%d", &req[i]);\n    printf("\\nFCFS Order: %d", head);\n    int movement = 0, curr = head;\n    for (int i = 0; i < n; i++) {\n        printf(" -> %d", req[i]);\n        movement += abs(req[i] - curr);\n        curr = req[i];\n    }\n    printf("\\nTotal Head Movement: %d\\n", movement);\n    return 0;\n}',
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
      console.log(` Upserted subject: ${subject.name}`);
    }

    // Upsert experiments
    for (const experiment of experiments) {
      await Experiment.findByIdAndUpdate(experiment._id, experiment, {
        upsert: true,
        new: true,
        runValidators: true,
      });
      console.log(
        ` Upserted experiment #${experiment.experimentNumber}: ${experiment.problemStatement.slice(0, 60)}...`
      );
    }

    console.log("\nOS seed complete!");
  } catch (err) {
    console.error("Seed failed:", err);
  } finally {
    await mongoose.connect(process.env.MONGODB_URI);
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
}

seed();
