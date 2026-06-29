require("dotenv").config({ path: __dirname + "/../.env" });
const mongoose = require("mongoose");
const {
  Types: { ObjectId },
} = mongoose;
const Subject = require("../models/Subject");
const Experiment = require("../models/Experiment");

const subjects = [
  {
    _id: new ObjectId("685b2a1f3c4e8d0012a7b000"),
    name: "C Programming",
    code: "VSEC102",
    semester: 1,
    description:
      "This subject covers practical C programming experiments including operators, control structures, functions, arrays, strings, structures, pointers, and file handling.",
  },
];

const experiments = [
  {
    _id: new ObjectId("685b2a1f3c4e8d0012a7b301"),
    subjectId: new ObjectId("685b2a1f3c4e8d0012a7b000"),
    experimentNumber: 1,
    problemStatement: "Program to demonstrate Operators",
    subExperiments: [
      {
        part: "a",
        title: "Data Input and Output",
        concepts: [
          "Standard Input/Output",
          "Formatting Specifiers",
          "Character I/O",
        ],
        hints: [
          "Use getchar() and putchar() for handling single characters.",
          "Use scanf() and printf() with format specifiers like %d and %s for formatted input and output.",
          "Use gets() (or fgets() for safer usage) and puts() for reading and writing strings.",
        ],
        difficulty: "Easy",
        problemStatement:
          "Write a program to demonstrate data input and output using getchar(), putchar(), scanf(), printf(), gets(), puts().",
        theory:
          "Input and output functions in C are used to read data from the user and display results. getchar() reads a single character, putchar() prints a single character, scanf() reads formatted input, printf() prints formatted output, gets() reads a string (deprecated), and puts() prints a string with a newline.",
        algorithm:
          "1. Start\n2. Use getchar() to read a character and putchar() to display it\n3. Use scanf() to read an integer and printf() to display it\n4. Use gets() to read a string and puts() to display it\n5. Stop",
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
              label: "Read char using getchar()",
            },
            {
              id: "3",
              type: "output",
              label: "Print char using putchar()",
            },
            {
              id: "4",
              type: "input",
              label: "Read integer using scanf()",
            },
            {
              id: "5",
              type: "output",
              label: "Print integer using printf()",
            },
            {
              id: "6",
              type: "input",
              label: "Read string using gets()",
            },
            {
              id: "7",
              type: "output",
              label: "Print string using puts()",
            },
            {
              id: "8",
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
          ],
        },
        referenceSolution: {
          c: '#include <stdio.h>\n\nint main() {\n    char ch;\n    char str1[100], str2[100];\n    int num;\n\n    printf("--- Demonstration of Input/Output Functions ---\\n");\n\n    /* ================= getchar() and putchar() ================= */\n    printf("\\nEnter a single character: ");\n    ch = getchar();   // reads a single character from stdin\n\n    printf("You entered character: ");\n    putchar(ch);      // prints a single character\n    printf("\\n");\n\n    // clear input buffer\n    while ((getchar()) != \'\\n\');\n\n    /* ================= scanf() and printf() ================= */\n    printf("\\nEnter an integer: ");\n    scanf("%d", &num);\n\n    printf("You entered number using scanf/printf: %d\\n", num);\n\n    // clear input buffer\n    while ((getchar()) != \'\\n\');\n\n    /* ================= gets() and puts() ================= */\n    printf("\\nEnter a string (using gets): ");\n    gets(str1);   // unsafe but used for demonstration\n\n    printf("You entered string using puts: ");\n    puts(str1);   // prints string with newline\n\n    /* ================= scanf() for string ================= */\n    printf("\\nEnter another word (using scanf): ");\n    scanf("%s", str2);\n\n    printf("You entered using scanf: %s\\n", str2);\n\n    printf("\\n--- End of Demonstration ---\\n");\n\n    return 0;\n}\n\n/*\nANALYSIS:\n- getchar(): reads one character from stdin\n- putchar(): prints one character to stdout\n- scanf(): formatted input function\n- printf(): formatted output function\n- gets(): reads full line until newline (unsafe, deprecated)\n- puts(): prints string with newline\n\nNOTE:\ngets() is unsafe and removed in modern C standards (use fgets instead)\n*/',
        },
        samples: [
          {
            input: "A\n42\nHello\nWorld",
            output:
              "--- Demonstration of Input/Output Functions ---\n\nEnter a single character: You entered character: A\n\nEnter an integer: You entered number using scanf/printf: 42\n\nEnter a string (using gets): You entered string using puts: Hello\n\nEnter another word (using scanf): You entered using scanf: World\n\n--- End of Demonstration ---\n",
          },
        ],
      },
      {
        part: "b",
        title: "Operators in C",
        concepts: [
          "Arithmetic Operators",
          "Relational & Logical Operators",
          "Bitwise & Unary Operators",
        ],
        hints: [
          "Recall that relational operators return 1 for true and 0 for false in C.",
          "Use arithmetic operators (+, -, *, /, %) to perform mathematical calculations.",
          "Bitwise operators (&, |, ^, ~, <<, >>) operate on binary representation of values.",
        ],
        difficulty: "Easy",
        problemStatement:
          "Write a program to demonstrate Arithmetic, Relational, Logical, Assignment, Unary, Conditional, Bitwise, Comma, and other operators.",
        theory:
          "Operators in C are symbols that perform operations on variables and values. Arithmetic operators perform math operations (+, -, *, /, %). Relational operators compare values (==, !=, <, >, <=, >=). Logical operators combine conditions (&&, ||, !). Assignment operators assign values (=, +=, -=). Unary operators work on a single operand (++, --). Conditional operator (?:) is a shorthand for if-else. Bitwise operators work on bits (&, |, ^, ~, <<, >>).",
        algorithm:
          "1. Start\n2. Declare variables a and b\n3. Demonstrate arithmetic operators: +, -, *, /, %\n4. Demonstrate relational operators: ==, !=, <, >, <=, >=\n5. Demonstrate logical operators: &&, ||, !\n6. Demonstrate assignment operators: =, +=, -=, *=, /=\n7. Demonstrate unary operators: ++, --\n8. Demonstrate conditional operator: ?:\n9. Demonstrate bitwise operators: &, |, ^, ~, <<, >>\n10. Display results\n11. Stop",
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
              label: "Read a, b",
            },
            {
              id: "3",
              type: "process",
              label: "Arithmetic: a+b, a-b, a*b, a/b, a%b",
            },
            {
              id: "4",
              type: "process",
              label: "Relational: a==b, a!=b, a<b, a>b",
            },
            {
              id: "5",
              type: "process",
              label: "Logical: a&&b, a||b, !a",
            },
            {
              id: "6",
              type: "process",
              label: "Bitwise: a&b, a|b, a^b, a<<1, a>>1",
            },
            {
              id: "7",
              type: "output",
              label: "Display all results",
            },
            {
              id: "8",
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
          ],
        },
        referenceSolution: {
          c: '#include <stdio.h>\n\nint main() {\n    int a, b;\n\n    printf("Enter two integers: ");\n    scanf("%d %d", &a, &b);\n\n    /* ================= ARITHMETIC OPERATORS ================= */\n    printf("\\n--- Arithmetic Operators ---\\n");\n    printf("a + b = %d\\n", a + b);\n    printf("a - b = %d\\n", a - b);\n    printf("a * b = %d\\n", a * b);\n    printf("a / b = %d\\n", (b != 0) ? (a / b) : 0);\n    printf("a %% b = %d\\n", (b != 0) ? (a % b) : 0);\n\n    /* ================= RELATIONAL OPERATORS ================= */\n    printf("\\n--- Relational Operators ---\\n");\n    printf("a == b: %d\\n", a == b);\n    printf("a != b: %d\\n", a != b);\n    printf("a > b: %d\\n", a > b);\n    printf("a < b: %d\\n", a < b);\n    printf("a >= b: %d\\n", a >= b);\n    printf("a <= b: %d\\n", a <= b);\n\n    /* ================= LOGICAL OPERATORS ================= */\n    printf("\\n--- Logical Operators ---\\n");\n    printf("(a > 0 && b > 0): %d\\n", (a > 0 && b > 0));\n    printf("(a > 0 || b > 0): %d\\n", (a > 0 || b > 0));\n    printf("!(a > 0): %d\\n", !(a > 0));\n\n    /* ================= ASSIGNMENT OPERATORS ================= */\n    printf("\\n--- Assignment Operators ---\\n");\n    int x = a;\n    printf("x = a -> %d\\n", x);\n    x += b;\n    printf("x += b -> %d\\n", x);\n    x -= b;\n    printf("x -= b -> %d\\n", x);\n    x *= b;\n    printf("x *= b -> %d\\n", x);\n\n    /* ================= UNARY OPERATORS ================= */\n    printf("\\n--- Unary Operators ---\\n");\n    printf("+a = %d\\n", +a);\n    printf("-a = %d\\n", -a);\n    printf("++a (pre-increment) = %d\\n", ++x);\n    printf("x-- (post-decrement) = %d\\n", x--);\n    printf("After x--: %d\\n", x);\n\n    /* ================= CONDITIONAL OPERATOR ================= */\n    printf("\\n--- Conditional Operator ---\\n");\n    int max = (a > b) ? a : b;\n    printf("Max of a and b = %d\\n", max);\n\n    /* ================= BITWISE OPERATORS ================= */\n    printf("\\n--- Bitwise Operators ---\\n");\n    printf("a & b = %d\\n", a & b);\n    printf("a | b = %d\\n", a | b);\n    printf("a ^ b = %d\\n", a ^ b);\n    printf("~a = %d\\n", ~a);\n    printf("a << 1 = %d\\n", a << 1);\n    printf("a >> 1 = %d\\n", a >> 1);\n\n    /* ================= COMMA OPERATOR ================= */\n    printf("\\n--- Comma Operator ---\\n");\n    int y;\n    y = (a = 5, b = 10, a + b);\n    printf("Result of (a=5, b=10, a+b) = %d\\n", y);\n\n    /* ================= OTHER OPERATOR (sizeof) ================= */\n    printf("\\n--- sizeof Operator ---\\n");\n    printf("Size of int = %zu bytes\\n", sizeof(int));\n    printf("Size of a = %zu bytes\\n", sizeof(a));\n\n    return 0;\n}\n\n/*\nANALYSIS:\n- Arithmetic: +, -, *, /, %\n- Relational: ==, !=, >, <, >=, <=\n- Logical: &&, ||, !\n- Assignment: =, +=, -=, *=\n- Unary: ++, --, +, -\n- Conditional: ? :\n- Bitwise: &, |, ^, ~, <<, >>\n- Comma: (expr1, expr2, expr3)\n- Other: sizeof\n\nTime Complexity: O(1) (only constant operations)\nSpace Complexity: O(1)\n*/',
        },
        samples: [
          {
            input: "10 3",
            output:
              "Enter two integers: \n--- Arithmetic Operators ---\na + b = 13\na - b = 7\na * b = 30\na / b = 3\na % b = 1\n\n--- Relational Operators ---\na == b: 0\na != b: 1\na > b: 1\na < b: 0\na >= b: 1\na <= b: 0\n\n--- Logical Operators ---\n(a > 0 && b > 0): 1\n(a > 0 || b > 0): 1\n!(a > 0): 0\n\n--- Assignment Operators ---\nx = a -> 10\nx += b -> 13\nx -= b -> 10\nx *= b -> 30\n\n--- Unary Operators ---\n+a = 10\n-a = -10\n++a (pre-increment) = 31\nx-- (post-decrement) = 31\nAfter x--: 30\n\n--- Conditional Operator ---\nMax of a and b = 10\n\n--- Bitwise Operators ---\na & b = 2\na | b = 11\na ^ b = 9\n~a = -11\na << 1 = 20\na >> 1 = 5\n\n--- Comma Operator ---\nResult of (a=5, b=10, a+b) = 15\n\n--- sizeof Operator ---\nSize of int = 4 bytes\nSize of a = 4 bytes\n",
          },
          {
            input: "8 8",
            output:
              "Enter two integers: \n--- Arithmetic Operators ---\na + b = 16\na - b = 0\na * b = 64\na / b = 1\na % b = 0\n\n--- Relational Operators ---\na == b: 1\na != b: 0\na > b: 0\na < b: 0\na >= b: 1\na <= b: 1\n\n--- Logical Operators ---\n(a > 0 && b > 0): 1\n(a > 0 || b > 0): 1\n!(a > 0): 0\n\n--- Assignment Operators ---\nx = a -> 8\nx += b -> 16\nx -= b -> 8\nx *= b -> 64\n\n--- Unary Operators ---\n+a = 8\n-a = -8\n++a (pre-increment) = 65\nx-- (post-decrement) = 65\nAfter x--: 64\n\n--- Conditional Operator ---\nMax of a and b = 8\n\n--- Bitwise Operators ---\na & b = 8\na | b = 8\na ^ b = 0\n~a = -9\na << 1 = 16\na >> 1 = 4\n\n--- Comma Operator ---\nResult of (a=5, b=10, a+b) = 15\n\n--- sizeof Operator ---\nSize of int = 4 bytes\nSize of a = 4 bytes\n",
          },
        ],
      },
    ],
  },
  {
    _id: new ObjectId("685b2a1f3c4e8d0012a7b302"),
    subjectId: new ObjectId("685b2a1f3c4e8d0012a7b000"),
    experimentNumber: 2,
    problemStatement: "Program to demonstrate Branching and Looping",
    subExperiments: [
      {
        part: "a",
        title: "Branching Statements",
        concepts: [
          "Conditional Logic",
          "If-Else Statements",
          "Multiway Decision Making",
        ],
        hints: [
          "Use 'if' for a single condition, 'else if' for additional conditional branches, and 'else' for default branch.",
          "Ensure that each condition evaluates to a boolean value (non-zero is true, zero is false).",
        ],
        difficulty: "Easy",
        problemStatement:
          "Write a program to demonstrate If statement, If-else statement, and Multiway decision.",
        theory:
          "Branching statements control the flow of execution based on conditions. The if statement executes a block only if the condition is true. The if-else statement executes one block if true and another if false. The multiway decision (if-else if-else or switch) allows choosing among multiple alternatives based on a value or condition.",
        algorithm:
          "1. Start\n2. Read a number n\n3. If n > 0, print Positive\n4. Else if n < 0, print Negative\n5. Else print Zero\n6. Stop",
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
              label: "Read n",
            },
            {
              id: "3",
              type: "decision",
              label: "n > 0?",
            },
            {
              id: "4",
              type: "output",
              label: "Print Positive",
            },
            {
              id: "5",
              type: "decision",
              label: "n < 0?",
            },
            {
              id: "6",
              type: "output",
              label: "Print Negative",
            },
            {
              id: "7",
              type: "output",
              label: "Print Zero",
            },
            {
              id: "8",
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
              source: "4",
              target: "8",
            },
            {
              source: "5",
              target: "6",
              label: "Yes",
            },
            {
              source: "5",
              target: "7",
              label: "No",
            },
            {
              source: "6",
              target: "8",
            },
            {
              source: "7",
              target: "8",
            },
          ],
        },
        referenceSolution: {
          c: '#include <stdio.h>\n\nint main() {\n    int num, choice;\n\n    printf("Enter a number: ");\n    scanf("%d", &num);\n\n    /* ================= IF STATEMENT ================= */\n    printf("\\n--- IF STATEMENT ---\\n");\n    if (num > 0) {\n        printf("Number is positive\\n");\n    }\n\n    if (num % 2 == 0) {\n        printf("Number is even\\n");\n    }\n\n    /* ================= IF-ELSE STATEMENT ================= */\n    printf("\\n--- IF-ELSE STATEMENT ---\\n");\n    if (num >= 18) {\n        printf("You are eligible to vote\\n");\n    } else {\n        printf("You are NOT eligible to vote\\n");\n    }\n\n    /* ================= MULTIWAY DECISION (SWITCH) ================= */\n    printf("\\n--- MULTIWAY DECISION (SWITCH CASE) ---\\n");\n    printf("Enter a choice (1-4): ");\n    scanf("%d", &choice);\n\n    switch (choice) {\n        case 1:\n            printf("You selected Option 1\\n");\n            break;\n        case 2:\n            printf("You selected Option 2\\n");\n            break;\n        case 3:\n            printf("You selected Option 3\\n");\n            break;\n        case 4:\n            printf("You selected Option 4\\n");\n            break;\n        default:\n            printf("Invalid choice\\n");\n    }\n\n    return 0;\n}\n\n/*\nANALYSIS:\n- IF: checks single condition\n- IF-ELSE: two-way decision\n- SWITCH: multiway decision based on constant values\n\nTime Complexity: O(1)\nSpace Complexity: O(1)\n*/',
        },
        samples: [
          {
            input: "10\n1",
            output:
              "Enter a number: \n--- IF STATEMENT ---\nNumber is positive\nNumber is even\n\n--- IF-ELSE STATEMENT ---\nYou are NOT eligible to vote\n\n--- MULTIWAY DECISION (SWITCH CASE) ---\nEnter a choice (1-4): You selected Option 1\n",
          },
          {
            input: "-5\n2",
            output:
              "Enter a number: \n--- IF STATEMENT ---\n\n--- IF-ELSE STATEMENT ---\nYou are NOT eligible to vote\n\n--- MULTIWAY DECISION (SWITCH CASE) ---\nEnter a choice (1-4): You selected Option 2\n",
          },
          {
            input: "0\n3",
            output:
              "Enter a number: \n--- IF STATEMENT ---\nNumber is even\n\n--- IF-ELSE STATEMENT ---\nYou are NOT eligible to vote\n\n--- MULTIWAY DECISION (SWITCH CASE) ---\nEnter a choice (1-4): You selected Option 3\n",
          },
        ],
      },
      {
        part: "b",
        title: "Looping Statements",
        concepts: [
          "Iteration & Loops",
          "Pre-test vs Post-test Loops",
          "Loop Control Variables",
        ],
        hints: [
          "A while loop checks the condition first, so it might not run even once.",
          "A do-while loop executes the body first and checks the condition at the end, guaranteeing at least one run.",
        ],
        difficulty: "Easy",
        problemStatement:
          "Write a program to demonstrate while and do-while loops.",
        theory:
          "Loops are used to execute a block of code repeatedly. The while loop checks the condition before executing the body — if the condition is false initially, the body never executes. The do-while loop executes the body at least once before checking the condition, making it useful when the loop must run at least once regardless of the condition.",
        algorithm:
          "1. Start\n2. Read n\n3. Initialize i = 1\n4. While i <= n, print i and increment i\n5. Initialize j = 1\n6. Do: print j and increment j, while j <= n\n7. Stop",
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
              label: "Read n",
            },
            {
              id: "3",
              type: "process",
              label: "i = 1",
            },
            {
              id: "4",
              type: "decision",
              label: "i <= n?",
            },
            {
              id: "5",
              type: "output",
              label: "Print i",
            },
            {
              id: "6",
              type: "process",
              label: "i++",
            },
            {
              id: "7",
              type: "process",
              label: "j = 1",
            },
            {
              id: "8",
              type: "output",
              label: "Print j",
            },
            {
              id: "9",
              type: "process",
              label: "j++",
            },
            {
              id: "10",
              type: "decision",
              label: "j <= n?",
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
              label: "Yes",
            },
            {
              source: "5",
              target: "6",
            },
            {
              source: "6",
              target: "4",
            },
            {
              source: "4",
              target: "7",
              label: "No",
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
              target: "8",
              label: "Yes",
            },
            {
              source: "10",
              target: "11",
              label: "No",
            },
          ],
        },
        referenceSolution: {
          c: '#include <stdio.h>\n\nint main() {\n    int n, i;\n\n    printf("Enter a number: ");\n    scanf("%d", &n);\n\n    /* ================= WHILE LOOP ================= */\n    printf("\\n--- WHILE LOOP: Counting from 1 to n ---\\n");\n    i = 1;\n    while (i <= n) {\n        printf("%d ", i);\n        i++;\n    }\n    printf("\\n");\n\n    /* ================= DO-WHILE LOOP ================= */\n    printf("\\n--- DO-WHILE LOOP: Counting from n down to 1 ---\\n");\n    i = n;\n    do {\n        printf("%d ", i);\n        i--;\n    } while (i >= 1);\n\n    printf("\\n");\n\n    /* ================= DIFFERENCE DEMO ================= */\n    printf("\\n--- DO-WHILE executes at least once ---\\n");\n    int x = 0;\n\n    do {\n        printf("This prints even if condition is false: %d\\n", x);\n    } while (x > 0);\n\n    return 0;\n}\n\n/*\nANALYSIS:\n\nWHILE LOOP:\n- Entry-controlled loop\n- Condition checked before execution\n\nDO-WHILE LOOP:\n- Exit-controlled loop\n- Executes at least once\n\nTime Complexity: O(n)\nSpace Complexity: O(1)\n*/',
        },
        samples: [
          {
            input: "5",
            output:
              "Enter a number: \n--- WHILE LOOP: Counting from 1 to n ---\n1 2 3 4 5 \n\n--- DO-WHILE LOOP: Counting from n down to 1 ---\n5 4 3 2 1 \n\n--- DO-WHILE executes at least once ---\nThis prints even if condition is false: 0\n",
          },
        ],
      },
    ],
  },
  {
    _id: new ObjectId("685b2a1f3c4e8d0012a7b303"),
    subjectId: new ObjectId("685b2a1f3c4e8d0012a7b000"),
    experimentNumber: 3,
    problemStatement: "Program to demonstrate Nested control structure",
    subExperiments: [
      {
        part: "a",
        title: "Switch, Continue, Break, Goto",
        concepts: ["Switch Case Selection", "Jump Statements", "Loop Control"],
        hints: [
          "Always use a 'break' statement at the end of each switch case to prevent fall-through.",
          "Use 'continue' to skip the rest of the current iteration and go to the next iteration of the loop.",
          "Avoid overuse of the 'goto' statement as it can make control flow hard to follow.",
        ],
        difficulty: "Easy",
        problemStatement:
          "Write a program to demonstrate Switch statement, Continue statement, Break statement, and Goto statement.",
        theory:
          "Switch statement selects one of many code blocks to execute based on a variable's value. Break exits the nearest loop or switch. Continue skips the rest of the current loop iteration and moves to the next. Goto transfers control unconditionally to a labeled statement — though its use is generally discouraged as it makes code harder to read.",
        algorithm:
          "1. Start\n2. Read choice\n3. Switch on choice: case 1 print Monday, case 2 print Tuesday, default print Invalid\n4. Demonstrate break by exiting a loop early\n5. Demonstrate continue by skipping even numbers in a loop\n6. Demonstrate goto by jumping to a label\n7. Stop",
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
              label: "Read choice",
            },
            {
              id: "3",
              type: "decision",
              label: "choice == 1?",
            },
            {
              id: "4",
              type: "output",
              label: "Print Monday",
            },
            {
              id: "5",
              type: "decision",
              label: "choice == 2?",
            },
            {
              id: "6",
              type: "output",
              label: "Print Tuesday",
            },
            {
              id: "7",
              type: "output",
              label: "Print Invalid",
            },
            {
              id: "8",
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
              source: "4",
              target: "8",
            },
            {
              source: "5",
              target: "6",
              label: "Yes",
            },
            {
              source: "5",
              target: "7",
              label: "No",
            },
            {
              source: "6",
              target: "8",
            },
            {
              source: "7",
              target: "8",
            },
          ],
        },
        referenceSolution: {
          c: '#include <stdio.h>\n\nint main() {\n    int choice, i;\n\n    printf("--- SWITCH, BREAK, CONTINUE, GOTO DEMO ---\\n");\n    printf("Enter a number (1-3) for switch demo: ");\n    scanf("%d", &choice);\n\n    /* ================= SWITCH STATEMENT ================= */\n    switch (choice) {\n        case 1:\n            printf("You selected case 1\\n");\n            break;  // exits switch\n        case 2:\n            printf("You selected case 2\\n");\n            break;\n        case 3:\n            printf("You selected case 3\\n");\n            break;\n        default:\n            printf("Invalid choice\\n");\n    }\n\n    /* ================= BREAK & CONTINUE ================= */\n    printf("\\n--- BREAK & CONTINUE IN LOOP ---\\n");\n\n    for (i = 1; i <= 10; i++) {\n\n        if (i == 5) {\n            printf("Skipping 5 using continue\\n");\n            continue;  // skip current iteration\n        }\n\n        if (i == 8) {\n            printf("Stopping loop at 8 using break\\n");\n            break;  // exit loop\n        }\n\n        printf("%d ", i);\n    }\n\n    /* ================= GOTO STATEMENT ================= */\n    printf("\\n\\n--- GOTO STATEMENT DEMO ---\\n");\n\n    int x = 1;\n\nstart:\n    printf("x = %d\\n", x);\n    x++;\n\n    if (x <= 3)\n        goto start;  // jumps back to label\n\n    printf("End of goto demo\\n");\n\n    return 0;\n}\n\n/*\nANALYSIS:\n\nSWITCH:\n- Multiway branching based on value\n- Uses break to prevent fall-through\n\nBREAK:\n- Terminates loop or switch immediately\n\nCONTINUE:\n- Skips current iteration\n\nGOTO:\n- Unconditional jump to label\n- Generally avoided due to poor readability\n\nTime Complexity: O(n) for loop demo\nSpace Complexity: O(1)\n*/',
        },
        samples: [
          {
            input: "1",
            output:
              "--- SWITCH, BREAK, CONTINUE, GOTO DEMO ---\nEnter a number (1-3) for switch demo: You selected case 1\n\n--- BREAK & CONTINUE IN LOOP ---\n1 2 3 4 Skipping 5 using continue\n6 7 Stopping loop at 8 using break\n\n\n--- GOTO STATEMENT DEMO ---\nx = 1\nx = 2\nx = 3\nEnd of goto demo\n",
          },
        ],
      },
    ],
  },
  {
    _id: new ObjectId("685b2a1f3c4e8d0012a7b304"),
    subjectId: new ObjectId("685b2a1f3c4e8d0012a7b000"),
    experimentNumber: 4,
    problemStatement:
      "Program to demonstrate Function, Passing Arguments to a Function (call by value and call by reference",
    subExperiments: [
      {
        part: "a",
        title: "Functions with Argument Passing",
        concepts: [
          "Function Definition & Prototypes",
          "Call by Value",
          "Call by Reference",
        ],
        hints: [
          "In Call by Value, modifications made to parameters inside the function do not affect the original variables.",
          "In Call by Reference, pass the addresses of variables using the address-of operator (&) and receive them using pointers (*).",
        ],
        difficulty: "Medium",
        problemStatement:
          "Write a program to demonstrate Function definition, call by value, and call by reference.",
        theory:
          "A function is a block of code that performs a specific task. In call by value, a copy of the argument is passed so the original variable is not modified. In call by reference, the address of the variable is passed using pointers, so changes inside the function affect the original variable.",
        algorithm:
          "1. Start\n2. Define a function swap_by_value(a, b) that swaps copies\n3. Define a function swap_by_reference(a, b) using pointers\n4. Read two numbers x and y\n5. Call swap_by_value(x, y) and show x, y are unchanged\n6. Call swap_by_reference(&x, &y) and show x, y are swapped\n7. Stop",
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
              label: "Read x, y",
            },
            {
              id: "3",
              type: "process",
              label: "Call swap_by_value(x, y)",
            },
            {
              id: "4",
              type: "output",
              label: "Print x, y (unchanged)",
            },
            {
              id: "5",
              type: "process",
              label: "Call swap_by_reference(&x, &y)",
            },
            {
              id: "6",
              type: "output",
              label: "Print x, y (swapped)",
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
        referenceSolution: {
          c: '#include <stdio.h>\n\n// Function definition (user-defined function)\nint add(int a, int b) {\n    return a + b;\n}\n\n// Call by value (changes not reflected outside)\nvoid callByValue(int x) {\n    x = x + 10;\n    printf("Inside callByValue: x = %d\\n", x);\n}\n\n// Call by reference (using pointers)\nvoid callByReference(int *x) {\n    *x = *x + 10;\n    printf("Inside callByReference: x = %d\\n", *x);\n}\n\nint main() {\n    int a, b;\n\n    printf("Enter two numbers: ");\n    scanf("%d %d", &a, &b);\n\n    // Function call\n    int sum = add(a, b);\n    printf("\\nSum using function: %d\\n", sum);\n\n    // Call by value demonstration\n    printf("\\n--- Call by Value ---\\n");\n    printf("Before callByValue: a = %d\\n", a);\n    callByValue(a);\n    printf("After callByValue: a = %d (unchanged)\\n", a);\n\n    // Call by reference demonstration\n    printf("\\n--- Call by Reference ---\\n");\n    printf("Before callByReference: b = %d\\n", b);\n    callByReference(&b);\n    printf("After callByReference: b = %d (changed)\\n", b);\n\n    return 0;\n}\n\n/*\nANALYSIS:\n\n1. Function Definition:\n   - Reusable block of code\n   - Improves modularity\n\n2. Call by Value:\n   - Copies value\n   - Original variable NOT modified\n\n3. Call by Reference:\n   - Passes address using pointer\n   - Original variable IS modified\n\nTime Complexity: O(1)\nSpace Complexity: O(1)\n*/',
        },
        samples: [
          {
            input: "10 20",
            output:
              "Enter two numbers: \nSum using function: 30\n\n--- Call by Value ---\nBefore callByValue: a = 10\nInside callByValue: x = 20\nAfter callByValue: a = 10 (unchanged)\n\n--- Call by Reference ---\nBefore callByReference: b = 20\nInside callByReference: x = 30\nAfter callByReference: b = 30 (changed)\n",
          },
        ],
      },
    ],
  },
  {
    _id: new ObjectId("685b2a1f3c4e8d0012a7b305"),
    subjectId: new ObjectId("685b2a1f3c4e8d0012a7b000"),
    experimentNumber: 5,
    problemStatement:
      "Implement an iterative and recursive functions for factorial/ Fibonacci series",
    subExperiments: [
      {
        part: "a",
        title: "Iterative Function",
        concepts: [
          "Iterative Logic",
          "Factorial Calculation",
          "Fibonacci Sequence",
        ],
        hints: [
          "Use a loop (like for or while) to iteratively calculate the product for factorial.",
          "For Fibonacci, maintain the state of the two previous terms (e.g., using variables a and b) and update them in each step.",
        ],
        difficulty: "Medium",
        problemStatement:
          "Implement an iterative function for factorial and Fibonacci.",
        theory:
          "An iterative function uses loops to repeat operations. Factorial of n (n!) is the product of all positive integers from 1 to n. Fibonacci series is a sequence where each number is the sum of the two preceding ones: 0, 1, 1, 2, 3, 5, 8... Iterative approaches use for or while loops and are generally more memory efficient than recursion.",
        algorithm:
          "1. Start\n2. Read n\n3. For factorial: initialize fact = 1, loop from i = 1 to n, multiply fact = fact * i\n4. Display factorial\n5. For Fibonacci: initialize a = 0, b = 1, loop n times, print a, then next = a + b, a = b, b = next\n6. Display Fibonacci series\n7. Stop",
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
              label: "Read n",
            },
            {
              id: "3",
              type: "process",
              label: "fact = 1, i = 1",
            },
            {
              id: "4",
              type: "decision",
              label: "i <= n?",
            },
            {
              id: "5",
              type: "process",
              label: "fact = fact * i, i++",
            },
            {
              id: "6",
              type: "output",
              label: "Print fact",
            },
            {
              id: "7",
              type: "process",
              label: "a = 0, b = 1, i = 0",
            },
            {
              id: "8",
              type: "decision",
              label: "i < n?",
            },
            {
              id: "9",
              type: "output",
              label: "Print a",
            },
            {
              id: "10",
              type: "process",
              label: "next = a+b, a = b, b = next, i++",
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
              label: "Yes",
            },
            {
              source: "5",
              target: "4",
            },
            {
              source: "4",
              target: "6",
              label: "No",
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
              source: "9",
              target: "10",
            },
            {
              source: "10",
              target: "8",
            },
            {
              source: "8",
              target: "11",
              label: "No",
            },
          ],
        },
        referenceSolution: {
          c: '#include <stdio.h>\n\n// Iterative function for factorial\nint factorial(int n) {\n    int fact = 1;\n\n    for (int i = 1; i <= n; i++) {\n        fact *= i;\n    }\n\n    return fact;\n}\n\n// Iterative function for Fibonacci series (prints n terms)\nvoid fibonacci(int n) {\n    int a = 0, b = 1, next;\n\n    printf("Fibonacci series: ");\n\n    for (int i = 1; i <= n; i++) {\n        printf("%d ", a);\n        next = a + b;\n        a = b;\n        b = next;\n    }\n\n    printf("\\n");\n}\n\nint main() {\n    int n;\n\n    printf("Enter a number: ");\n    scanf("%d", &n);\n\n    // Factorial\n    printf("Factorial of %d = %d\\n", n, factorial(n));\n\n    // Fibonacci\n    fibonacci(n);\n\n    return 0;\n}\n\n/*\nANALYSIS:\n\n1. Factorial:\n   - Time Complexity: O(n)\n   - Space Complexity: O(1)\n\n2. Fibonacci (iterative):\n   - Time Complexity: O(n)\n   - Space Complexity: O(1)\n\nAdvantages over recursion:\n- No stack overhead\n- More efficient for large inputs\n*/',
        },
        samples: [
          {
            input: "5",
            output:
              "Enter a number: Factorial of 5 = 120\nFibonacci series: 0 1 1 2 3 \n",
          },
        ],
      },
      {
        part: "b",
        title: "Recursive Function",
        concepts: ["Recursion", "Base Case", "Stack Frames"],
        hints: [
          "Identify the base case where the recursion stops (e.g., n == 0 or n == 1) to avoid infinite recursion.",
          "Express the solution of the problem in terms of a smaller instance of the same problem (recursive step).",
        ],
        difficulty: "Medium",
        problemStatement:
          "Implement a recursive function for factorial and Fibonacci.",
        theory:
          "Recursion is when a function calls itself to solve smaller instances of the same problem. Every recursive function has a base case (stopping condition) and a recursive case. For factorial: fact(n) = n * fact(n-1), base case fact(0) = 1. For Fibonacci: fib(n) = fib(n-1) + fib(n-2), base cases fib(0) = 0, fib(1) = 1. Recursion uses the call stack and can be less efficient than iteration for large inputs.",
        algorithm:
          "1. Start\n2. Read n\n3. For factorial: if n == 0 return 1, else return n * factorial(n-1)\n4. For Fibonacci: if n == 0 return 0, if n == 1 return 1, else return fib(n-1) + fib(n-2)\n5. Display results\n6. Stop",
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
              label: "Read n",
            },
            {
              id: "3",
              type: "decision",
              label: "n == 0?",
            },
            {
              id: "4",
              type: "output",
              label: "Return 1",
            },
            {
              id: "5",
              type: "process",
              label: "Return n * factorial(n-1)",
            },
            {
              id: "6",
              type: "output",
              label: "Print factorial",
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
              label: "Yes",
            },
            {
              source: "3",
              target: "5",
              label: "No",
            },
            {
              source: "4",
              target: "6",
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
        referenceSolution: {
          c: '#include <stdio.h>\n\n// Recursive factorial function\nint factorial(int n) {\n    if (n == 0 || n == 1)\n        return 1;\n    else\n        return n * factorial(n - 1);\n}\n\n// Recursive Fibonacci function\nint fibonacci(int n) {\n    if (n == 0)\n        return 0;\n    if (n == 1)\n        return 1;\n    return fibonacci(n - 1) + fibonacci(n - 2);\n}\n\nint main() {\n    int n;\n\n    printf("Enter a number: ");\n    scanf("%d", &n);\n\n    // Factorial\n    printf("Factorial of %d = %d\\n", n, factorial(n));\n\n    // Fibonacci series\n    printf("Fibonacci series: ");\n    for (int i = 0; i < n; i++) {\n        printf("%d ", fibonacci(i));\n    }\n\n    printf("\\n");\n\n    return 0;\n}\n\n/*\nANALYSIS:\n\n1. Recursive Factorial:\n   - Time Complexity: O(n)\n   - Space Complexity: O(n) (recursion stack)\n\n2. Recursive Fibonacci:\n   - Time Complexity: O(2^n) (very inefficient due to repeated calls)\n   - Space Complexity: O(n)\n\nNOTE:\n- Factorial recursion is efficient\n- Fibonacci recursion is exponential and should use DP/iteration for optimization\n*/',
        },
        samples: [
          {
            input: "5",
            output:
              "Enter a number: Factorial of 5 = 120\nFibonacci series: 0 1 1 2 3 \n",
          },
        ],
      },
    ],
  },
  {
    _id: new ObjectId("685b2a1f3c4e8d0012a7b306"),
    subjectId: new ObjectId("685b2a1f3c4e8d0012a7b000"),
    experimentNumber: 6,
    problemStatement: "Program to demonstrate Storage Classes",
    subExperiments: [
      {
        part: "a",
        title: "Auto, Extern, Static, Register",
        concepts: [
          "Storage Classes",
          "Variable Scope & Lifetime",
          "Memory Segments",
        ],
        hints: [
          "Static variables retain their values across multiple function calls and are initialized only once.",
          "Use the 'extern' keyword to share a variable definition across multiple translation units.",
          "The 'register' keyword is a hint to the compiler to store the variable in a CPU register for faster access.",
        ],
        difficulty: "Medium",
        problemStatement:
          "Write a program to demonstrate Auto, Extern, Static, and Register storage classes.",
        theory:
          "Storage classes define the scope, lifetime, and visibility of variables. Auto is the default for local variables, created and destroyed with the function. Extern declares a variable defined in another file or globally. Static preserves the variable's value between function calls and limits scope to the file. Register suggests storing the variable in a CPU register for faster access.",
        algorithm:
          "1. Start\n2. Demonstrate auto variable inside a function\n3. Demonstrate static variable that retains its value across calls\n4. Demonstrate extern variable shared across files\n5. Demonstrate register variable for fast access\n6. Display results\n7. Stop",
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
              label: "auto int x = 10",
            },
            {
              id: "3",
              type: "process",
              label: "static int count = 0; count++",
            },
            {
              id: "4",
              type: "process",
              label: "register int r = 5",
            },
            {
              id: "5",
              type: "output",
              label: "Display all variables",
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
        referenceSolution: {
          c: '#include <stdio.h>\n\n/*\n   Demonstration of storage classes:\n   auto, extern, static, register\n*/\n\n// Global variable (extern storage class by default)\nint globalVar = 100;\n\n// Function declaration for extern demo\nvoid externDemo();\n\nvoid staticDemo() {\n    // Static variable retains value between function calls\n    static int count = 0;\n    count++;\n    printf("Static variable count = %d\\n", count);\n}\n\nvoid registerDemo() {\n    // register suggests storing variable in CPU register\n    register int i;\n\n    int sum = 0;\n\n    for (i = 1; i <= 5; i++) {\n        sum += i;\n    }\n\n    printf("Register variable loop sum = %d\\n", sum);\n}\n\nvoid externDemo() {\n    // Using extern variable defined globally\n    extern int globalVar;\n\n    printf("Extern variable value = %d\\n", globalVar);\n}\n\nint main() {\n    /* ================= AUTO STORAGE CLASS ================= */\n    // Default for local variables\n    auto int a = 10;\n    int b = 20;  // also auto by default\n\n    printf("--- Auto Storage Class ---\\n");\n    printf("a = %d, b = %d\\n", a, b);\n\n    /* ================= EXTERN STORAGE CLASS ================= */\n    printf("\\n--- Extern Storage Class ---\\n");\n    externDemo();\n\n    /* ================= STATIC STORAGE CLASS ================= */\n    printf("\\n--- Static Storage Class ---\\n");\n    staticDemo();\n    staticDemo();\n    staticDemo();\n\n    /* ================= REGISTER STORAGE CLASS ================= */\n    printf("\\n--- Register Storage Class ---\\n");\n    registerDemo();\n\n    return 0;\n}\n\n/*\nANALYSIS:\n\n1. auto:\n   - Default for local variables\n   - Scope: local\n   - Lifetime: function block\n\n2. extern:\n   - Refers to global variable defined outside function\n   - Used for sharing variables across files\n\n3. static:\n   - Retains value between function calls\n   - Lifetime: entire program execution\n\n4. register:\n   - Suggests storing variable in CPU register\n   - Faster access (compiler may ignore suggestion)\n\nTime Complexity: O(1)\nSpace Complexity: O(1)\n*/',
        },
        samples: [
          {
            input: "",
            output:
              "--- Auto Storage Class ---\na = 10, b = 20\n\n--- Extern Storage Class ---\nExtern variable value = 100\n\n--- Static Storage Class ---\nStatic variable count = 1\nStatic variable count = 2\nStatic variable count = 3\n\n--- Register Storage Class ---\nRegister variable loop sum = 15\n",
          },
        ],
      },
    ],
  },
  {
    _id: new ObjectId("685b2a1f3c4e8d0012a7b307"),
    subjectId: new ObjectId("685b2a1f3c4e8d0012a7b000"),
    experimentNumber: 7,
    problemStatement: "Program to demonstrate 1D and 2D Arrays",
    subExperiments: [
      {
        part: "a",
        title: "1D Array",
        concepts: [
          "Contiguous Memory",
          "Array Indexing",
          "Traversal Operations",
        ],
        hints: [
          "Remember that arrays are zero-indexed, meaning elements range from index 0 to size - 1.",
          "Use a loop to iterate through the indices of the array to read or print elements.",
        ],
        difficulty: "Medium",
        problemStatement:
          "Write a program to demonstrate 1D Array operations in C.",
        theory:
          "A 1D array is a collection of elements of the same data type stored in contiguous memory locations. Elements are accessed using an index starting from 0. Common operations include traversal, insertion, deletion, searching, and sorting.",
        algorithm:
          "1. Start\n2. Declare array of size n\n3. Read n elements into the array\n4. Traverse and display all elements\n5. Search for an element using linear search\n6. Sort the array using bubble sort\n7. Display sorted array\n8. Stop",
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
              label: "Read n",
            },
            {
              id: "3",
              type: "input",
              label: "Read n elements",
            },
            {
              id: "4",
              type: "output",
              label: "Display elements",
            },
            {
              id: "5",
              type: "process",
              label: "Sort array",
            },
            {
              id: "6",
              type: "output",
              label: "Display sorted array",
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
        referenceSolution: {
          c: '#include <stdio.h>\n\n#define MAX 100\n\n// Function to display array\nvoid display(int arr[], int n) {\n    printf("Array elements: ");\n    for (int i = 0; i < n; i++) {\n        printf("%d ", arr[i]);\n    }\n    printf("\\n");\n}\n\nint main() {\n    int arr[MAX];\n    int n, choice, pos, value;\n\n    printf("Enter number of elements: ");\n    scanf("%d", &n);\n\n    printf("Enter array elements:\\n");\n    for (int i = 0; i < n; i++) {\n        scanf("%d", &arr[i]);\n    }\n\n    while (1) {\n        printf("\\n--- 1D Array Operations ---\\n");\n        printf("1. Display\\n");\n        printf("2. Insert\\n");\n        printf("3. Delete\\n");\n        printf("4. Search\\n");\n        printf("5. Update\\n");\n        printf("6. Exit\\n");\n        printf("Enter choice: ");\n        scanf("%d", &choice);\n\n        switch (choice) {\n            case 1:\n                display(arr, n);\n                break;\n\n            case 2:\n                printf("Enter position and value: ");\n                scanf("%d %d", &pos, &value);\n\n                if (pos < 0 || pos > n) {\n                    printf("Invalid position\\n");\n                } else {\n                    for (int i = n; i > pos; i--) {\n                        arr[i] = arr[i - 1];\n                    }\n                    arr[pos] = value;\n                    n++;\n                }\n                break;\n\n            case 3:\n                printf("Enter position to delete: ");\n                scanf("%d", &pos);\n\n                if (pos < 0 || pos >= n) {\n                    printf("Invalid position\\n");\n                } else {\n                    for (int i = pos; i < n - 1; i++) {\n                        arr[i] = arr[i + 1];\n                    }\n                    n--;\n                }\n                break;\n\n            case 4:\n                printf("Enter value to search: ");\n                scanf("%d", &value);\n\n                pos = -1;\n                for (int i = 0; i < n; i++) {\n                    if (arr[i] == value) {\n                        pos = i;\n                        break;\n                    }\n                }\n\n                if (pos != -1)\n                    printf("Element found at index %d\\n", pos);\n                else\n                    printf("Element not found\\n");\n                break;\n\n            case 5:\n                printf("Enter position and new value: ");\n                scanf("%d %d", &pos, &value);\n\n                if (pos < 0 || pos >= n)\n                    printf("Invalid position\\n");\n                else\n                    arr[pos] = value;\n                break;\n\n            case 6:\n                return 0;\n\n            default:\n                printf("Invalid choice\\n");\n        }\n    }\n\n    return 0;\n}\n\n/*\nANALYSIS:\n\nOperations:\n- Insert: O(n)\n- Delete: O(n)\n- Search: O(n)\n- Update: O(1)\n- Display: O(n)\n\nSpace Complexity: O(n)\n\nNote:\nArray is static and elements are shifted for insertion/deletion.\n*/',
        },
        samples: [
          {
            input: "5\n4 1 3 5 2\n1\n6",
            output:
              "Enter number of elements: Enter array elements:\n\n--- 1D Array Operations ---\n1. Display\n2. Insert\n3. Delete\n4. Search\n5. Update\n6. Exit\nEnter choice: Array elements: 4 1 3 5 2 \n\n--- 1D Array Operations ---\n1. Display\n2. Insert\n3. Delete\n4. Search\n5. Update\n6. Exit\nEnter choice: ",
          },
        ],
      },
      {
        part: "b",
        title: "2D Array",
        concepts: ["Matrices", "Nested Loops", "Row-Major Order"],
        hints: [
          "Access elements in a 2D array using double indexing, e.g., matrix[row][col].",
          "Use nested loops to traverse rows and columns for input, output, or calculation.",
        ],
        difficulty: "Medium",
        problemStatement:
          "Write a program to demonstrate 2D Array (Matrix) operations in C.",
        theory:
          "A 2D array is an array of arrays, representing a matrix with rows and columns. Elements are accessed using two indices arr[row][col]. Common operations include matrix addition, subtraction, multiplication, and transpose.",
        algorithm:
          "1. Start\n2. Read dimensions m x n for two matrices A and B\n3. Read elements of matrix A\n4. Read elements of matrix B\n5. Add matrices A and B to get C\n6. Display matrix C\n7. Multiply matrices if dimensions allow\n8. Stop",
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
              label: "Read m, n",
            },
            {
              id: "3",
              type: "input",
              label: "Read matrix A",
            },
            {
              id: "4",
              type: "input",
              label: "Read matrix B",
            },
            {
              id: "5",
              type: "process",
              label: "C[i][j] = A[i][j] + B[i][j]",
            },
            {
              id: "6",
              type: "output",
              label: "Display matrix C",
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
        referenceSolution: {
          c: '#include <stdio.h>\n\n#define MAX 10\n\n// Function to display matrix\nvoid display(int mat[MAX][MAX], int r, int c) {\n    for (int i = 0; i < r; i++) {\n        for (int j = 0; j < c; j++) {\n            printf("%d ", mat[i][j]);\n        }\n        printf("\\n");\n    }\n}\n\nint main() {\n    int a[MAX][MAX], b[MAX][MAX], result[MAX][MAX];\n    int r1, c1, r2, c2;\n    int choice;\n\n    printf("Enter rows and columns of matrix A: ");\n    scanf("%d %d", &r1, &c1);\n\n    printf("Enter elements of matrix A:\\n");\n    for (int i = 0; i < r1; i++) {\n        for (int j = 0; j < c1; j++) {\n            scanf("%d", &a[i][j]);\n        }\n    }\n\n    printf("Enter rows and columns of matrix B: ");\n    scanf("%d %d", &r2, &c2);\n\n    printf("Enter elements of matrix B:\\n");\n    for (int i = 0; i < r2; i++) {\n        for (int j = 0; j < c2; j++) {\n            scanf("%d", &b[i][j]);\n        }\n    }\n\n    while (1) {\n        printf("\\n--- Matrix Operations ---\\n");\n        printf("1. Display Matrices\\n");\n        printf("2. Addition\\n");\n        printf("3. Multiplication\\n");\n        printf("4. Transpose of A\\n");\n        printf("5. Exit\\n");\n        printf("Enter choice: ");\n        scanf("%d", &choice);\n\n        if (choice == 1) {\n            printf("\\nMatrix A:\\n");\n            display(a, r1, c1);\n\n            printf("\\nMatrix B:\\n");\n            display(b, r2, c2);\n        }\n\n        else if (choice == 2) {\n            if (r1 == r2 && c1 == c2) {\n                printf("\\nAddition Result:\\n");\n                for (int i = 0; i < r1; i++) {\n                    for (int j = 0; j < c1; j++) {\n                        result[i][j] = a[i][j] + b[i][j];\n                        printf("%d ", result[i][j]);\n                    }\n                    printf("\\n");\n                }\n            } else {\n                printf("Addition not possible (dimension mismatch)\\n");\n            }\n        }\n\n        else if (choice == 3) {\n            if (c1 == r2) {\n                printf("\\nMultiplication Result:\\n");\n\n                for (int i = 0; i < r1; i++) {\n                    for (int j = 0; j < c2; j++) {\n                        result[i][j] = 0;\n                        for (int k = 0; k < c1; k++) {\n                            result[i][j] += a[i][k] * b[k][j];\n                        }\n                        printf("%d ", result[i][j]);\n                    }\n                    printf("\\n");\n                }\n            } else {\n                printf("Multiplication not possible\\n");\n            }\n        }\n\n        else if (choice == 4) {\n            printf("\\nTranspose of Matrix A:\\n");\n            for (int i = 0; i < c1; i++) {\n                for (int j = 0; j < r1; j++) {\n                    printf("%d ", a[j][i]);\n                }\n                printf("\\n");\n            }\n        }\n\n        else if (choice == 5) {\n            break;\n        }\n\n        else {\n            printf("Invalid choice\\n");\n        }\n    }\n\n    return 0;\n}\n\n/*\nANALYSIS:\n\n1. Matrix Addition: O(n^2)\n2. Matrix Multiplication: O(n^3)\n3. Transpose: O(n^2)\n4. Display: O(n^2)\n\nSpace Complexity: O(n^2)\n\nKey Concepts:\n- 2D array representation\n- Nested loops for traversal\n- Dimension checking for operations\n*/',
        },
        samples: [
          {
            input: "2 2\n1 2\n3 4\n2 2\n5 6\n7 8\n1\n5",
            output:
              "Enter rows and columns of matrix A: Enter elements of matrix A:\nEnter rows and columns of matrix B: Enter elements of matrix B:\n\n--- Matrix Operations ---\n1. Display Matrices\n2. Addition\n3. Multiplication\n4. Transpose of A\n5. Exit\nEnter choice: \nMatrix A:\n1 2 \n3 4 \n\nMatrix B:\n5 6 \n7 8 \n\n--- Matrix Operations ---\n1. Display Matrices\n2. Addition\n3. Multiplication\n4. Transpose of A\n5. Exit\nEnter choice: ",
          },
        ],
      },
    ],
  },
  {
    _id: new ObjectId("685b2a1f3c4e8d0012a7b308"),
    subjectId: new ObjectId("685b2a1f3c4e8d0012a7b000"),
    experimentNumber: 8,
    problemStatement: "Program to demonstrate String and Arrays of strings",
    subExperiments: [
      {
        part: "a",
        title: "String Operations",
        concepts: [
          "String Manipulation",
          "Standard Library string.h",
          "Null-terminated Strings",
        ],
        hints: [
          "Include <string.h> to access built-in functions like strlen(), strcpy(), and strcat().",
          "Always reserve space for the null-terminating character '\\0' at the end of the string.",
          "Use strcmp() to compare two strings lexicographically; it returns 0 if they are equal.",
        ],
        difficulty: "Medium",
        problemStatement:
          "Write a program to demonstrate String operations in C.",
        theory:
          "Strings in C are arrays of characters terminated by a null character '\\0'. The string.h library provides functions like strlen() for length, strcpy() for copying, strcat() for concatenation, strcmp() for comparison, and strrev() for reversing a string.",
        algorithm:
          "1. Start\n2. Read a string s\n3. Find length using strlen()\n4. Copy to another string using strcpy()\n5. Concatenate two strings using strcat()\n6. Compare two strings using strcmp()\n7. Display results\n8. Stop",
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
              label: "Read string s1, s2",
            },
            {
              id: "3",
              type: "process",
              label: "len = strlen(s1)",
            },
            {
              id: "4",
              type: "process",
              label: "strcpy(dest, s1)",
            },
            {
              id: "5",
              type: "process",
              label: "strcat(s1, s2)",
            },
            {
              id: "6",
              type: "process",
              label: "cmp = strcmp(s1, s2)",
            },
            {
              id: "7",
              type: "output",
              label: "Display all results",
            },
            {
              id: "8",
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
          ],
        },
        referenceSolution: {
          c: '#include <stdio.h>\n\n#define MAX 100\n\n// Function to find length of string\nint stringLength(char str[]) {\n    int i = 0;\n    while (str[i] != \'\\0\') {\n        i++;\n    }\n    return i;\n}\n\n// Function to copy string\nvoid stringCopy(char dest[], char src[]) {\n    int i = 0;\n    while (src[i] != \'\\0\') {\n        dest[i] = src[i];\n        i++;\n    }\n    dest[i] = \'\\0\';\n}\n\n// Function to compare strings\nint stringCompare(char s1[], char s2[]) {\n    int i = 0;\n    while (s1[i] != \'\\0\' && s2[i] != \'\\0\') {\n        if (s1[i] != s2[i]) {\n            return s1[i] - s2[i];\n        }\n        i++;\n    }\n    return s1[i] - s2[i];\n}\n\n// Function to concatenate strings\nvoid stringConcat(char dest[], char src[]) {\n    int i = 0, j = 0;\n\n    while (dest[i] != \'\\0\') {\n        i++;\n    }\n\n    while (src[j] != \'\\0\') {\n        dest[i] = src[j];\n        i++;\n        j++;\n    }\n\n    dest[i] = \'\\0\';\n}\n\nint main() {\n    char str1[MAX], str2[MAX], str3[MAX];\n    int choice;\n\n    printf("Enter first string: ");\n    scanf(" %[^\\n]", str1);\n\n    printf("Enter second string: ");\n    scanf(" %[^\\n]", str2);\n\n    while (1) {\n        printf("\\n--- STRING OPERATIONS ---\\n");\n        printf("1. Length\\n");\n        printf("2. Copy\\n");\n        printf("3. Concatenate\\n");\n        printf("4. Compare\\n");\n        printf("5. Display Strings\\n");\n        printf("6. Exit\\n");\n        printf("Enter choice: ");\n        scanf("%d", &choice);\n\n        switch (choice) {\n            case 1:\n                printf("Length of str1 = %d\\n", stringLength(str1));\n                printf("Length of str2 = %d\\n", stringLength(str2));\n                break;\n\n            case 2:\n                stringCopy(str3, str1);\n                printf("Copied str1 into str3: %s\\n", str3);\n                break;\n\n            case 3:\n                stringCopy(str3, str1);\n                stringConcat(str3, str2);\n                printf("Concatenated string: %s\\n", str3);\n                break;\n\n            case 4:\n                if (stringCompare(str1, str2) == 0)\n                    printf("Strings are equal\\n");\n                else if (stringCompare(str1, str2) > 0)\n                    printf("str1 is greater than str2\\n");\n                else\n                    printf("str1 is smaller than str2\\n");\n                break;\n\n            case 5:\n                printf("str1 = %s\\n", str1);\n                printf("str2 = %s\\n", str2);\n                break;\n\n            case 6:\n                return 0;\n\n            default:\n                printf("Invalid choice\\n");\n        }\n    }\n\n    return 0;\n}\n\n/*\nANALYSIS:\n\nOperations:\n- Length: O(n)\n- Copy: O(n)\n- Concatenation: O(n)\n- Compare: O(n)\n\nSpace Complexity: O(n)\n\nNote:\n- Custom implementation without string.h library\n- Uses character-by-character processing\n*/',
        },
        samples: [
          {
            input: "Hello\nWorld\n1\n6",
            output:
              "Enter first string: Enter second string: \n--- STRING OPERATIONS ---\n1. Length\n2. Copy\n3. Concatenate\n4. Compare\n5. Display Strings\n6. Exit\nEnter choice: Length of str1 = 5\nLength of str2 = 5\n\n--- STRING OPERATIONS ---\n1. Length\n2. Copy\n3. Concatenate\n4. Compare\n5. Display Strings\n6. Exit\nEnter choice: ",
          },
        ],
      },
      {
        part: "b",
        title: "Array of Strings",
        concepts: [
          "Two-dimensional Arrays",
          "String Arrays",
          "Row-based Access",
        ],
        hints: [
          "Represent an array of strings as a 2D char array where the first dimension is the number of strings and the second is the max length.",
          "Access individual strings using a single index, e.g., names[i].",
        ],
        difficulty: "Medium",
        problemStatement:
          "Write a program to demonstrate arrays of strings in C.",
        theory:
          "An array of strings in C is a 2D character array where each row is a string. It can be declared as char arr[n][max_len]. Alternatively, an array of character pointers can be used. Common operations include reading, displaying, sorting, and searching strings in the array.",
        algorithm:
          "1. Start\n2. Declare array of strings with n rows\n3. Read n strings\n4. Display all strings\n5. Sort strings alphabetically using strcmp()\n6. Display sorted strings\n7. Stop",
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
              label: "Read n",
            },
            {
              id: "3",
              type: "input",
              label: "Read n strings",
            },
            {
              id: "4",
              type: "output",
              label: "Display strings",
            },
            {
              id: "5",
              type: "process",
              label: "Sort using strcmp()",
            },
            {
              id: "6",
              type: "output",
              label: "Display sorted strings",
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
        referenceSolution: {
          c: '#include <stdio.h>\n#include <string.h>\n\n#define MAX 10\n#define LEN 50\n\nint main() {\n    char names[MAX][LEN];\n    int n;\n    int choice;\n\n    printf("Enter number of strings: ");\n    scanf("%d", &n);\n\n    // Input array of strings\n    printf("Enter %d strings:\\n", n);\n    for (int i = 0; i < n; i++) {\n        scanf(" %[^\\n]", names[i]);\n    }\n\n    while (1) {\n        printf("\\n--- ARRAY OF STRINGS OPERATIONS ---\\n");\n        printf("1. Display Strings\\n");\n        printf("2. Sort Strings (Alphabetical)\\n");\n        printf("3. Search String\\n");\n        printf("4. Reverse Each String\\n");\n        printf("5. Exit\\n");\n        printf("Enter choice: ");\n        scanf("%d", &choice);\n\n        if (choice == 1) {\n            printf("\\nStrings:\\n");\n            for (int i = 0; i < n; i++) {\n                printf("%s\\n", names[i]);\n            }\n        }\n\n        else if (choice == 2) {\n            // Bubble sort\n            char temp[LEN];\n            for (int i = 0; i < n - 1; i++) {\n                for (int j = i + 1; j < n; j++) {\n                    if (strcmp(names[i], names[j]) > 0) {\n                        strcpy(temp, names[i]);\n                        strcpy(names[i], names[j]);\n                        strcpy(names[j], temp);\n                    }\n                }\n            }\n            printf("Strings sorted successfully.\\n");\n        }\n\n        else if (choice == 3) {\n            char key[LEN];\n            int found = 0;\n\n            printf("Enter string to search: ");\n            scanf(" %[^\\n]", key);\n\n            for (int i = 0; i < n; i++) {\n                if (strcmp(names[i], key) == 0) {\n                    printf("Found at index %d\\n", i);\n                    found = 1;\n                    break;\n                }\n            }\n\n            if (!found)\n                printf("String not found\\n");\n        }\n\n        else if (choice == 4) {\n            printf("\\nReversing each string:\\n");\n            for (int i = 0; i < n; i++) {\n                int len = strlen(names[i]);\n                for (int j = len - 1; j >= 0; j--) {\n                    printf("%c", names[i][j]);\n                }\n                printf("\\n");\n            }\n        }\n\n        else if (choice == 5) {\n            break;\n        }\n\n        else {\n            printf("Invalid choice\\n");\n        }\n    }\n\n    return 0;\n}\n\n/*\nANALYSIS:\n\nOperations:\n- Display: O(n)\n- Sort (Bubble Sort): O(n^2)\n- Search: O(n)\n- Reverse: O(n * m)\n\nWhere:\n- n = number of strings\n- m = length of each string\n\nSpace Complexity: O(n * m)\n*/',
        },
        samples: [
          {
            input: "3\nZebra\nApple\nMango\n1\n5",
            output:
              "Enter number of strings: Enter 3 strings:\n\n--- ARRAY OF STRINGS OPERATIONS ---\n1. Display Strings\n2. Sort Strings (Alphabetical)\n3. Search String\n4. Reverse Each String\n5. Exit\nEnter choice: \nStrings:\nZebra\nApple\nMango\n\n--- ARRAY OF STRINGS OPERATIONS ---\n1. Display Strings\n2. Sort Strings (Alphabetical)\n3. Search String\n4. Reverse Each String\n5. Exit\nEnter choice: ",
          },
        ],
      },
    ],
  },
  {
    _id: new ObjectId("685b2a1f3c4e8d0012a7b309"),
    subjectId: new ObjectId("685b2a1f3c4e8d0012a7b000"),
    experimentNumber: 9,
    problemStatement: "Program to demonstrate Structure",
    subExperiments: [
      {
        part: "a",
        title:
          "Define a Structure, Read and Store Details, and Display Stored Information",
        problemStatement:
          "Define a structure to store student/employee details, read and store multiple records, and display the stored information using structure arrays.",
        concepts: [
          "User-defined Data Types",
          "Structures",
          "Member Access Operator",
        ],
        hints: [
          "Use the 'struct' keyword to define a new collection of different data types.",
          "Declare members like name, age, and ID within the structure body.",
          "Instantiate structure variables or arrays of structure to hold the records.",
          "Use the dot (.) operator to access and write data to structure members.",
          "Iterate over structure variables using a loop to access each record.",
        ],
        difficulty: "Medium",
        theory:
          "A structure in C is a user-defined data type that allows grouping of variables of different data types under a single name. Each variable inside a structure is called a member and is accessed using the dot (.) operator. Arrays of structures allow storing multiple records efficiently. Data can be inserted, stored, and displayed using loops.",
        algorithm:
          "1. Start\n2. Define structure Student with fields: rollNo, name, branch, marks\n3. Declare array of structures\n4. Read number of students (n)\n5. For i = 0 to n-1, input student details\n6. Store data in structure array\n7. Display all stored records using loop\n8. Stop",
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
              label: "Define struct Student",
            },
            {
              id: "3",
              type: "input",
              label: "Read n",
            },
            {
              id: "4",
              type: "process",
              label: "i = 0",
            },
            {
              id: "5",
              type: "decision",
              label: "i < n?",
            },
            {
              id: "6",
              type: "input",
              label: "Read student[i] details",
            },
            {
              id: "7",
              type: "process",
              label: "i++",
            },
            {
              id: "8",
              type: "output",
              label: "Display student[i] details",
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
            },
            {
              source: "4",
              target: "5",
            },
            {
              source: "5",
              target: "6",
              label: "Yes (Input Phase)",
            },
            {
              source: "6",
              target: "7",
            },
            {
              source: "7",
              target: "5",
            },
            {
              source: "5",
              target: "8",
              label: "No (Start Display)",
            },
            {
              source: "8",
              target: "9",
            },
          ],
        },
        referenceSolution: {
          c: '#include <stdio.h>\n\n#define MAX 100\n\n// Structure definition\nstruct Student {\n    int rollNo;\n    char name[50];\n    char branch[50];\n    float marks;\n};\n\nint main() {\n    struct Student s[MAX];\n    int n;\n\n    // Input number of students\n    printf("Enter number of students: ");\n    scanf("%d", &n);\n\n    // Input student details\n    for (int i = 0; i < n; i++) {\n        printf("\\n--- Enter details of student %d ---\\n", i + 1);\n\n        printf("Roll No: ");\n        scanf("%d", &s[i].rollNo);\n\n        printf("Name: ");\n        scanf(" %[^\\n]", s[i].name);\n\n        printf("Branch: ");\n        scanf(" %[^\\n]", s[i].branch);\n\n        printf("Marks: ");\n        scanf("%f", &s[i].marks);\n    }\n\n    // Display student details\n    printf("\\n===== STUDENT DETAILS =====\\n");\n    for (int i = 0; i < n; i++) {\n        printf("\\nStudent %d\\n", i + 1);\n        printf("Roll No : %d\\n", s[i].rollNo);\n        printf("Name    : %s\\n", s[i].name);\n        printf("Branch  : %s\\n", s[i].branch);\n        printf("Marks   : %.2f\\n", s[i].marks);\n    }\n\n    return 0;\n}\n\n/*\nTIME COMPLEXITY: O(n)\nSPACE COMPLEXITY: O(n)\n\nCONCEPTS:\n- Structures in C\n- Array of structures\n- Input/output using scanf/printf\n- Loop traversal of records\n*/',
        },
        samples: [
          {
            input: "2\n1\nAlice\nCS\n95.5\n2\nBob\nIT\n88.0",
            output:
              "Enter number of students: \n--- Enter details of student 1 ---\nRoll No: Name: Branch: Marks: \n--- Enter details of student 2 ---\nRoll No: Name: Branch: Marks: \n===== STUDENT DETAILS =====\n\nStudent 1\nRoll No : 1\nName    : Alice\nBranch  : CS\nMarks   : 95.50\n\nStudent 2\nRoll No : 2\nName    : Bob\nBranch  : IT\nMarks   : 88.00\n",
          },
        ],
      },
    ],
  },
  {
    _id: new ObjectId("685b2a1f3c4e8d0012a7b310"),
    subjectId: new ObjectId("685b2a1f3c4e8d0012a7b000"),
    experimentNumber: 10,
    problemStatement: "Program to demonstrate pointers",
    subExperiments: [
      {
        part: "a",
        title: "Define a Node Structure and Insert, Delete, and Display Nodes",
        problemStatement:
          "Define a node structure for a linked list and implement insertion, deletion, and display operations on a singly linked list.",
        concepts: [
          "Self-referential Structures",
          "Linked List Nodes",
          "Pointers to Structs",
          "Dynamic Memory Allocation",
          "Pointer Manipulation",
          "Linked List Traversal",
        ],
        hints: [
          "Use a self-referential structure where one of the members is a pointer to the same structure type.",
          "Use 'struct Node* next' to hold the address of the next node in the sequence.",
          "Use malloc() to dynamically allocate memory for new nodes at runtime.",
          "Update pointers carefully when inserting or deleting nodes to prevent breaking the list linkage.",
          "Traverse the list by starting from the head node and following the next pointers until you reach NULL.",
        ],
        difficulty: "Hard",
        theory:
          "A linked list is a dynamic linear data structure where each node contains data and a pointer to the next node. Unlike arrays, linked lists use non-contiguous memory and grow dynamically using malloc(). Each node is a self-referential structure containing a data field and a pointer to another node of the same type. Basic operations include insertion, deletion, and traversal.",
        algorithm:
          "1. Start\n2. Define struct Node with data and next pointer\n3. Initialize head = NULL\n4. To insert: create node using malloc, attach at end or beginning\n5. To delete: search node, update links, free memory\n6. To display: traverse from head to NULL and print data\n7. Stop",
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
              label: "Define struct Node { data, *next }",
            },
            {
              id: "3",
              type: "process",
              label: "head = NULL",
            },
            {
              id: "4",
              type: "process",
              label: "Insert node using malloc()",
            },
            {
              id: "5",
              type: "decision",
              label: "Delete node?",
            },
            {
              id: "6",
              type: "process",
              label: "Update pointers & free node",
            },
            {
              id: "7",
              type: "output",
              label: "Traverse & display list",
            },
            {
              id: "8",
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
              source: "5",
              target: "7",
              label: "No",
            },
            {
              source: "6",
              target: "7",
            },
            {
              source: "7",
              target: "8",
            },
          ],
        },
        referenceSolution: {
          c: '#include <stdio.h>\n#include <stdlib.h>\n\n// Node structure\nstruct Node {\n    int data;\n    struct Node *next;\n};\n\nstruct Node *head = NULL;\n\n// Create new node\nstruct Node* createNode(int value) {\n    struct Node *newNode = (struct Node*)malloc(sizeof(struct Node));\n    newNode->data = value;\n    newNode->next = NULL;\n    return newNode;\n}\n\n// Insert at end\nvoid insertEnd(int value) {\n    struct Node *newNode = createNode(value);\n\n    if (head == NULL) {\n        head = newNode;\n        return;\n    }\n\n    struct Node *temp = head;\n    while (temp->next != NULL) {\n        temp = temp->next;\n    }\n\n    temp->next = newNode;\n}\n\n// Delete node by value\nvoid deleteNode(int value) {\n    struct Node *temp = head, *prev = NULL;\n\n    if (temp != NULL && temp->data == value) {\n        head = temp->next;\n        free(temp);\n        return;\n    }\n\n    while (temp != NULL && temp->data != value) {\n        prev = temp;\n        temp = temp->next;\n    }\n\n    if (temp == NULL) {\n        printf("Value not found\\n");\n        return;\n    }\n\n    prev->next = temp->next;\n    free(temp);\n}\n\n// Display list\nvoid display() {\n    struct Node *temp = head;\n\n    if (temp == NULL) {\n        printf("List is empty\\n");\n        return;\n    }\n\n    while (temp != NULL) {\n        printf("%d -> ", temp->data);\n        temp = temp->next;\n    }\n    printf("NULL\\n");\n}\n\nint main() {\n    int choice, value;\n\n    while (1) {\n        printf("\\n--- Linked List Menu ---\\n");\n        printf("1. Insert\\n2. Delete\\n3. Display\\n4. Exit\\n");\n        printf("Enter choice: ");\n        scanf("%d", &choice);\n\n        switch (choice) {\n            case 1:\n                printf("Enter value: ");\n                scanf("%d", &value);\n                insertEnd(value);\n                break;\n\n            case 2:\n                printf("Enter value to delete: ");\n                scanf("%d", &value);\n                deleteNode(value);\n                break;\n\n            case 3:\n                display();\n                break;\n\n            case 4:\n                exit(0);\n\n            default:\n                printf("Invalid choice\\n");\n        }\n    }\n\n    return 0;\n}\n\n/*\nTIME COMPLEXITY:\n- Insert: O(n)\n- Delete: O(n)\n- Display: O(n)\n\nSPACE COMPLEXITY: O(n)\n\nCONCEPTS:\n- Linked list implementation\n- Dynamic memory allocation\n- Pointer manipulation\n- Traversal operations\n*/',
        },
        samples: [
          {
            input: "1\n10\n1\n20\n3\n2\n20\n3\n4",
            output:
              "\n--- Linked List Menu ---\n1. Insert\n2. Delete\n3. Display\n4. Exit\nEnter choice: Enter value: \n--- Linked List Menu ---\n1. Insert\n2. Delete\n3. Display\n4. Exit\nEnter choice: Enter value: \n--- Linked List Menu ---\n1. Insert\n2. Delete\n3. Display\n4. Exit\nEnter choice: 10 -> 20 -> NULL\n\n--- Linked List Menu ---\n1. Insert\n2. Delete\n3. Display\n4. Exit\nEnter choice: Enter value to delete: \n--- Linked List Menu ---\n1. Insert\n2. Delete\n3. Display\n4. Exit\nEnter choice: 10 -> NULL\n\n--- Linked List Menu ---\n1. Insert\n2. Delete\n3. Display\n4. Exit\nEnter choice: ",
          },
        ],
      },
    ],
  },
  {
    _id: new ObjectId("685b2a1f3c4e8d0012a7b311"),
    subjectId: new ObjectId("685b2a1f3c4e8d0012a7b000"),
    experimentNumber: 11,
    problemStatement: "Program to demonstrate files and file handling",
    subExperiments: [
      {
        part: "a",
        title:
          "Open a File to Store Student Records, Add, Update, and Display Records and Ensure Data Persistence",
        problemStatement:
          "Implement file handling in C to store student records, perform add/update/display operations, and ensure data persistence.",
        concepts: [
          "File Handling in C",
          "File Modes (r, w, a)",
          "File I/O Functions (fopen, fprintf, fscanf, fclose, fflush)",
        ],
        hints: [
          "Open the file in write mode ('w') or append mode ('a') using fopen().",
          "Check if the file pointer is NULL to ensure the file was opened successfully.",
          "Use fprintf() / fscanf() for text files, or fwrite() / fread() to write and read structures directly in binary mode.",
          "When updating records, you can read all records into memory, modify the target record, and write them back.",
          "Close the file stream using fclose() after every operation to ensure all buffers are flushed to disk.",
          "Avoid keeping the file open indefinitely to protect against data corruption during unexpected program termination.",
        ],
        difficulty: "Hard",
        theory:
          "File handling in C allows permanent storage of data using files. Structures can be written to files using fprintf() or fread(). Files are opened using modes like 'r' (read), 'w' (write), and 'a' (append). Data persistence is ensured by immediately writing updates to the file and properly closing it using fclose(). fflush() forces buffer data to be written to disk, ensuring integrity.",
        algorithm:
          "1. Start\n2. Define structure Student\n3. Implement file operations (open, read, write, append)\n4. Add student: open file in append mode and write record\n5. Display students: open file in read mode and read all records\n6. Update student: read all records, modify, and rewrite file\n7. Ensure persistence using fclose() and fflush()\n8. Stop",
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
              label: "Define Student Structure",
            },
            {
              id: "3",
              type: "process",
              label: "Open file (r/w/a mode)",
            },
            {
              id: "4",
              type: "process",
              label: "Add / Update / Display Records",
            },
            {
              id: "5",
              type: "decision",
              label: "Operation Type?",
            },
            {
              id: "6",
              type: "process",
              label: "Write new record (append mode)",
            },
            {
              id: "7",
              type: "process",
              label: "Read & display records",
            },
            {
              id: "8",
              type: "process",
              label: "Modify record & rewrite file",
            },
            {
              id: "9",
              type: "process",
              label: "fflush() + fclose()",
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
              label: "Add",
            },
            {
              source: "5",
              target: "7",
              label: "Display",
            },
            {
              source: "5",
              target: "8",
              label: "Update",
            },
            {
              source: "6",
              target: "9",
            },
            {
              source: "7",
              target: "9",
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
        referenceSolution: {
          c: '#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nstruct Student {\n    int rollNo;\n    char name[50];\n    char branch[50];\n    float marks;\n};\n\nvoid addStudent() {\n    FILE *fp = fopen("students.txt", "a");\n    struct Student s;\n\n    if (fp == NULL) {\n        printf("Error opening file!\\n");\n        return;\n    }\n\n    printf("Enter Roll No: ");\n    scanf("%d", &s.rollNo);\n\n    printf("Enter Name: ");\n    scanf(" %[^\\n]", s.name);\n\n    printf("Enter Branch: ");\n    scanf(" %[^\\n]", s.branch);\n\n    printf("Enter Marks: ");\n    scanf("%f", &s.marks);\n\n    fprintf(fp, "%d %s %s %.2f\\n", s.rollNo, s.name, s.branch, s.marks);\n\n    fclose(fp);\n    printf("Student added successfully.\\n");\n}\n\nvoid displayStudents() {\n    FILE *fp = fopen("students.txt", "r");\n    struct Student s;\n\n    if (fp == NULL) {\n        printf("No records found!\\n");\n        return;\n    }\n\n    while (fscanf(fp, "%d %s %s %f", &s.rollNo, s.name, s.branch, &s.marks) != EOF) {\n        printf("%d %s %s %.2f\\n", s.rollNo, s.name, s.branch, s.marks);\n    }\n\n    fclose(fp);\n}\n\nvoid updateStudent() {\n    FILE *fp = fopen("students.txt", "r");\n    FILE *temp = fopen("temp.txt", "w");\n\n    struct Student s;\n    int roll, found = 0;\n\n    printf("Enter Roll No to update: ");\n    scanf("%d", &roll);\n\n    while (fscanf(fp, "%d %s %s %f", &s.rollNo, s.name, s.branch, &s.marks) != EOF) {\n        if (s.rollNo == roll) {\n            printf("Enter new name: ");\n            scanf(" %[^\\n]", s.name);\n\n            printf("Enter new branch: ");\n            scanf(" %[^\\n]", s.branch);\n\n            printf("Enter new marks: ");\n            scanf("%f", &s.marks);\n\n            found = 1;\n        }\n        fprintf(temp, "%d %s %s %.2f\\n", s.rollNo, s.name, s.branch, s.marks);\n    }\n\n    fclose(fp);\n    fclose(temp);\n\n    remove("students.txt");\n    rename("temp.txt", "students.txt");\n\n    if (found)\n        printf("Record updated successfully.\\n");\n    else\n        printf("Record not found.\\n");\n}\n\nint main() {\n    int choice;\n\n    while (1) {\n        printf("\\n1. Add\\n2. Display\\n3. Update\\n4. Exit\\n");\n        scanf("%d", &choice);\n\n        switch (choice) {\n            case 1: addStudent(); break;\n            case 2: displayStudents(); break;\n            case 3: updateStudent(); break;\n            case 4: exit(0);\n        }\n    }\n\n    return 0;\n}\n\n/*\nTIME COMPLEXITY:\n- Add: O(1)\n- Display: O(n)\n- Update: O(n)\n\nSPACE COMPLEXITY: O(1)\n\nCONCEPTS:\n- File handling\n- Structure serialization\n- Persistent storage\n- Menu-driven program\n*/',
        },
        samples: [
          {
            input: "1\n1\nAlice\nCS\n95.5\n2\n4",
            output:
              "\n1. Add\n2. Display\n3. Update\n4. Exit\nEnter Roll No: Enter Name: Enter Branch: Enter Marks: Student added successfully.\n\n1. Add\n2. Display\n3. Update\n4. Exit\n1 Alice CS 95.50\n\n1. Add\n2. Display\n3. Update\n4. Exit\n",
          },
        ],
      },
    ],
  },
  {
    _id: new ObjectId("685b2a1f3c4e8d0012a7b312"),
    subjectId: new ObjectId("685b2a1f3c4e8d0012a7b000"),
    experimentNumber: 12,
    problemStatement:
      "Implement one small application using Function, Files, Structure and Pointers",
    subExperiments: [
      {
        part: "a",
        title:
          "Functions – Add, Display, Search Books, Files – Store and Retrieve Book Data, Structures – Represent a Book, Pointers – Manage Book List Dynamically",
        problemStatement:
          "Implement a library management system using C that demonstrates structures, functions, pointers, and file handling for managing book records.",
        concepts: [
          "Structures in C",
          "Modular Programming using Functions",
          "File Handling (fopen, fread, fwrite, fprintf, fscanf)",
          "Dynamic Memory Allocation",
          "Pointers and Pointer Arithmetic",
          "Array of Structures",
        ],
        hints: [
          "Design distinct functions for each operation: addBook(), displayBooks(), and searchBook().",
          "Pass the books array and its current count as arguments to these functions.",
          "Save the book records to a text or binary file during program termination.",
          "Load the book records back into memory when the program starts up.",
          "Define a structure 'struct Book' with fields like title, author, and price.",
          "Choose appropriate data types for each field (e.g., character arrays for text and float for price).",
          "Use a pointer to point to the dynamically allocated book array in the heap.",
          "Use realloc() to resize the book list dynamically as the number of books grows.",
        ],
        difficulty: "Hard",
        theory:
          "A library management system demonstrates multiple core C programming concepts. Structures are used to represent books. Functions provide modular operations like add, display, and search. Pointers and dynamic memory allocation allow flexible storage of book records. File handling ensures persistent storage so that data is not lost after program termination. Together, these concepts form a complete system for managing book records efficiently.",
        algorithm:
          "1. Start\n2. Define Book structure with id, title, author, price\n3. Initialize book storage (array or dynamic pointer)\n4. Implement functions: addBook(), displayBooks(), searchBook()\n5. Use pointers and realloc() for dynamic memory management\n6. Save and load books using file handling\n7. Perform operations based on user input\n8. Stop",
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
              label: "Define Book structure",
            },
            {
              id: "3",
              type: "process",
              label: "Initialize storage (array/pointer)",
            },
            {
              id: "4",
              type: "process",
              label: "Add Book (function)",
            },
            {
              id: "5",
              type: "process",
              label: "Display Books (function)",
            },
            {
              id: "6",
              type: "process",
              label: "Search Book (function)",
            },
            {
              id: "7",
              type: "process",
              label: "File Operations (save/load)",
            },
            {
              id: "8",
              type: "process",
              label: "Dynamic memory (realloc/free)",
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
          ],
        },
        referenceSolution: {
          c: '#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\ntypedef struct {\n    int id;\n    char title[100];\n    char author[50];\n    float price;\n} Book;\n\nBook *books = NULL;\nint count = 0;\n\nvoid addBook() {\n    books = realloc(books, (count + 1) * sizeof(Book));\n\n    printf("Enter ID: ");\n    scanf("%d", &books[count].id);\n\n    printf("Enter Title: ");\n    scanf(" %[^\\n]", books[count].title);\n\n    printf("Enter Author: ");\n    scanf(" %[^\\n]", books[count].author);\n\n    printf("Enter Price: ");\n    scanf("%f", &books[count].price);\n\n    count++;\n}\n\nvoid displayBooks() {\n    for (int i = 0; i < count; i++) {\n        printf("%d | %s | %s | %.2f\\n",\n               books[i].id,\n               books[i].title,\n               books[i].author,\n               books[i].price);\n    }\n}\n\nvoid searchBook(char title[]) {\n    int found = 0;\n\n    for (int i = 0; i < count; i++) {\n        if (strcmp(books[i].title, title) == 0) {\n            printf("Found: %d | %s | %s | %.2f\\n",\n                   books[i].id,\n                   books[i].title,\n                   books[i].author,\n                   books[i].price);\n            found = 1;\n        }\n    }\n\n    if (!found)\n        printf("Book not found\\n");\n}\n\nvoid saveToFile() {\n    FILE *fp = fopen("books.txt", "w");\n\n    for (int i = 0; i < count; i++) {\n        fprintf(fp, "%d %s %s %.2f\\n",\n                books[i].id,\n                books[i].title,\n                books[i].author,\n                books[i].price);\n    }\n\n    fclose(fp);\n}\n\nvoid loadFromFile() {\n    FILE *fp = fopen("books.txt", "r");\n    if (!fp) return;\n\n    Book temp;\n\n    while (fscanf(fp, "%d %s %s %f",\n                  &temp.id,\n                  temp.title,\n                  temp.author,\n                  &temp.price) != EOF) {\n\n        books = realloc(books, (count + 1) * sizeof(Book));\n        books[count++] = temp;\n    }\n\n    fclose(fp);\n}\n\nint main() {\n    loadFromFile();\n\n    int choice;\n    char title[100];\n\n    while (1) {\n        printf("\\n1. Add\\n2. Display\\n3. Search\\n4. Exit\\n");\n        scanf("%d", &choice);\n\n        switch (choice) {\n            case 1: addBook(); saveToFile(); break;\n            case 2: displayBooks(); break;\n            case 3:\n                printf("Enter title: ");\n                scanf(" %[^\\n]", title);\n                searchBook(title);\n                break;\n            case 4:\n                saveToFile();\n                free(books);\n                exit(0);\n        }\n    }\n\n    return 0;\n}\n\n/*\nTIME COMPLEXITY:\n- Add: O(n) (realloc)\n- Display: O(n)\n- Search: O(n)\n- File operations: O(n)\n\nSPACE COMPLEXITY: O(n)\n\nCONCEPTS:\n- Structures\n- Functions\n- Pointers\n- Dynamic memory allocation\n- File handling\n- Persistent storage system\n*/',
        },
        samples: [
          {
            input: "1\n1\nC_Programming\nKernighan\n299\n2\n4",
            output:
              "\n1. Add\n2. Display\n3. Search\n4. Exit\nEnter ID: Enter Title: Enter Author: Enter Price: \n1. Add\n2. Display\n3. Search\n4. Exit\n1 | C_Programming | Kernighan | 299.00\n\n1. Add\n2. Display\n3. Search\n4. Exit\n",
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

    // Only removes CP data
    await Subject.deleteMany({ code: "VSEC102" });
    await Experiment.deleteMany({
      subjectId: new ObjectId("685b2a1f3c4e8d0012a7b000"),
    });
    console.log("Cleared existing CP data.");

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
