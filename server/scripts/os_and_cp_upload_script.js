require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const { Types: { ObjectId } } = mongoose;
const Subject = require('../models/Subject');
const Experiment = require('../models/Experiment');

const subjects = [
  {
    "_id": new ObjectId("685b2a1f3c4e8d0012a7b000"),
    "name": "C Programming",
    "code": "VSEC102",
    "semester": 1,
    "description": "This subject covers practical C programming experiments including operators, control structures, functions, arrays, strings, structures, pointers, and file handling."
  },
  {
    "_id": new ObjectId("685b2a1f3c4e8d0012a7b001"),
    "name": "Operating System",
    "code": "2114113",
    "semester": 4,
    "description": "This subject covers practical OS experiments including process management, CPU scheduling, synchronization, memory management, file allocation, and disk scheduling."
  }
];

const experiments = [
  {
    "_id": new ObjectId("685b2a1f3c4e8d0012a7b301"),
    "subjectId": new ObjectId("685b2a1f3c4e8d0012a7b000"),
    "experimentNumber": 1,
    "subExperiments": [
      {
        "part": "a",
        "title": "Data Input and Output",
        "problemStatement": "Write a program to demonstrate data input and output using getchar(), putchar(), scanf(), printf(), gets(), puts().",
        "theory": "Input and output functions in C are used to read data from the user and display results. getchar() reads a single character, putchar() prints a single character, scanf() reads formatted input, printf() prints formatted output, gets() reads a string (deprecated), and puts() prints a string with a newline.",
        "algorithm": "1. Start\n2. Use getchar() to read a character and putchar() to display it\n3. Use scanf() to read an integer and printf() to display it\n4. Use gets() to read a string and puts() to display it\n5. Stop",
        "flowchart": {
          "nodes": [
            {
              "id": "1",
              "type": "start",
              "label": "Start"
            },
            {
              "id": "2",
              "type": "input",
              "label": "Read char using getchar()"
            },
            {
              "id": "3",
              "type": "output",
              "label": "Print char using putchar()"
            },
            {
              "id": "4",
              "type": "input",
              "label": "Read integer using scanf()"
            },
            {
              "id": "5",
              "type": "output",
              "label": "Print integer using printf()"
            },
            {
              "id": "6",
              "type": "input",
              "label": "Read string using gets()"
            },
            {
              "id": "7",
              "type": "output",
              "label": "Print string using puts()"
            },
            {
              "id": "8",
              "type": "end",
              "label": "Stop"
            }
          ],
          "edges": [
            {
              "source": "1",
              "target": "2"
            },
            {
              "source": "2",
              "target": "3"
            },
            {
              "source": "3",
              "target": "4"
            },
            {
              "source": "4",
              "target": "5"
            },
            {
              "source": "5",
              "target": "6"
            },
            {
              "source": "6",
              "target": "7"
            },
            {
              "source": "7",
              "target": "8"
            }
          ]
        },
        "starterCode": {
          "supportedLanguages": [
            "c"
          ],
          "templates": {
            "c": "#include <stdio.h>\n\nvoid demonstrateIO() {\n    // Write your code here\n    // 1. Read char using getchar(), print using putchar()\n    // 2. Read integer using scanf(), print using printf()\n    // 3. Read string using fgets(), print using puts()\n}\n\nint main() {\n    demonstrateIO();\n    return 0;\n}"
          }
        },
        "samples": [
          {
            "input": "A\n42\nHello",
            "output": "Enter a character: You entered: A\nEnter an integer: You entered: 42\nEnter a string: You entered: Hello\n"
          }
        ]
      },
      {
        "part": "b",
        "title": "Operators in C",
        "problemStatement": "Write a program to demonstrate Arithmetic, Relational, Logical, Assignment, Unary, Conditional, Bitwise, Comma, and other operators.",
        "theory": "Operators in C are symbols that perform operations on variables and values. Arithmetic operators perform math operations (+, -, *, /, %). Relational operators compare values (==, !=, <, >, <=, >=). Logical operators combine conditions (&&, ||, !). Assignment operators assign values (=, +=, -=). Unary operators work on a single operand (++, --). Conditional operator (?:) is a shorthand for if-else. Bitwise operators work on bits (&, |, ^, ~, <<, >>).",
        "algorithm": "1. Start\n2. Declare variables a and b\n3. Demonstrate arithmetic operators: +, -, *, /, %\n4. Demonstrate relational operators: ==, !=, <, >, <=, >=\n5. Demonstrate logical operators: &&, ||, !\n6. Demonstrate assignment operators: =, +=, -=, *=, /=\n7. Demonstrate unary operators: ++, --\n8. Demonstrate conditional operator: ?:\n9. Demonstrate bitwise operators: &, |, ^, ~, <<, >>\n10. Display results\n11. Stop",
        "flowchart": {
          "nodes": [
            {
              "id": "1",
              "type": "start",
              "label": "Start"
            },
            {
              "id": "2",
              "type": "input",
              "label": "Read a, b"
            },
            {
              "id": "3",
              "type": "process",
              "label": "Arithmetic: a+b, a-b, a*b, a/b, a%b"
            },
            {
              "id": "4",
              "type": "process",
              "label": "Relational: a==b, a!=b, a<b, a>b"
            },
            {
              "id": "5",
              "type": "process",
              "label": "Logical: a&&b, a||b, !a"
            },
            {
              "id": "6",
              "type": "process",
              "label": "Bitwise: a&b, a|b, a^b, a<<1, a>>1"
            },
            {
              "id": "7",
              "type": "output",
              "label": "Display all results"
            },
            {
              "id": "8",
              "type": "end",
              "label": "Stop"
            }
          ],
          "edges": [
            {
              "source": "1",
              "target": "2"
            },
            {
              "source": "2",
              "target": "3"
            },
            {
              "source": "3",
              "target": "4"
            },
            {
              "source": "4",
              "target": "5"
            },
            {
              "source": "5",
              "target": "6"
            },
            {
              "source": "6",
              "target": "7"
            },
            {
              "source": "7",
              "target": "8"
            }
          ]
        },
        "starterCode": {
          "supportedLanguages": [
            "c"
          ],
          "templates": {
            "c": "#include <stdio.h>\n\nvoid demonstrateOperators(int a, int b) {\n    // Write your code here\n    //\n    // Display the results of:\n    // 1. Arithmetic operators (+, -, *, /, %)\n    // 2. Relational operators (==, !=, <, >, <=, >=)\n    // 3. Logical operators (&&, ||, !)\n    // 4. Assignment operators (=, +=, -=, *=, /=)\n    // 5. Unary operators (++, --)\n    // 6. Conditional operator (?:)\n    // 7. Bitwise operators (&, |, ^, ~, <<, >>)\n}\n\nint main() {\n    int a, b;\n\n    scanf(\"%d %d\", &a, &b);\n\n    demonstrateOperators(a, b);\n\n    return 0;\n}"
          }
        },
        "samples": [
          {
            "input": "10 3",
            "output": "Arithmetic:\na + b = 13\na - b = 7\na * b = 30\na / b = 3\na % b = 1\n\nRelational:\na == b = 0\na != b = 1\na < b = 0\na > b = 1\na <= b = 0\na >= b = 1\n\nLogical:\na && b = 1\na || b = 1\n!a = 0\n\nAssignment:\nAfter += : 13\nAfter -= : 10\nAfter *= : 30\nAfter /= : 10\n\nUnary:\n++a = 11\n--b = 2\n\nConditional:\nMaximum = 10\n\nBitwise:\na & b = 2\na | b = 11\na ^ b = 9\n~a = -11\na << 1 = 20\na >> 1 = 5"
          },
          {
            "input": "8 8",
            "output": "Arithmetic:\na + b = 16\na - b = 0\na * b = 64\na / b = 1\na % b = 0\n\nRelational:\na == b = 1\na != b = 0\na < b = 0\na > b = 0\na <= b = 1\na >= b = 1\n\nLogical:\na && b = 1\na || b = 1\n!a = 0\n\nAssignment:\nAfter += : 16\nAfter -= : 8\nAfter *= : 64\nAfter /= : 8\n\nUnary:\n++a = 9\n--b = 7\n\nConditional:\nMaximum = 8\n\nBitwise:\na & b = 8\na | b = 8\na ^ b = 0\n~a = -9\na << 1 = 16\na >> 1 = 4"
          }
        ]
      }
    ]
  },
  {
    "_id": new ObjectId("685b2a1f3c4e8d0012a7b302"),
    "subjectId": new ObjectId("685b2a1f3c4e8d0012a7b000"),
    "experimentNumber": 2,
    "subExperiments": [
      {
        "part": "a",
        "title": "Branching Statements",
        "problemStatement": "Write a program to demonstrate If statement, If-else statement, and Multiway decision.",
        "theory": "Branching statements control the flow of execution based on conditions. The if statement executes a block only if the condition is true. The if-else statement executes one block if true and another if false. The multiway decision (if-else if-else or switch) allows choosing among multiple alternatives based on a value or condition.",
        "algorithm": "1. Start\n2. Read a number n\n3. If n > 0, print Positive\n4. Else if n < 0, print Negative\n5. Else print Zero\n6. Stop",
        "flowchart": {
          "nodes": [
            {
              "id": "1",
              "type": "start",
              "label": "Start"
            },
            {
              "id": "2",
              "type": "input",
              "label": "Read n"
            },
            {
              "id": "3",
              "type": "decision",
              "label": "n > 0?"
            },
            {
              "id": "4",
              "type": "output",
              "label": "Print Positive"
            },
            {
              "id": "5",
              "type": "decision",
              "label": "n < 0?"
            },
            {
              "id": "6",
              "type": "output",
              "label": "Print Negative"
            },
            {
              "id": "7",
              "type": "output",
              "label": "Print Zero"
            },
            {
              "id": "8",
              "type": "end",
              "label": "Stop"
            }
          ],
          "edges": [
            {
              "source": "1",
              "target": "2"
            },
            {
              "source": "2",
              "target": "3"
            },
            {
              "source": "3",
              "target": "4",
              "label": "Yes"
            },
            {
              "source": "3",
              "target": "5",
              "label": "No"
            },
            {
              "source": "4",
              "target": "8"
            },
            {
              "source": "5",
              "target": "6",
              "label": "Yes"
            },
            {
              "source": "5",
              "target": "7",
              "label": "No"
            },
            {
              "source": "6",
              "target": "8"
            },
            {
              "source": "7",
              "target": "8"
            }
          ]
        },
        "starterCode": {
          "supportedLanguages": [
            "c"
          ],
          "templates": {
            "c": "#include <stdio.h>\n\nvoid checkNumber(int n) {\n    // Write your code here\n    // Print Positive, Negative, or Zero\n}\n\nint main() {\n    int n;\n    scanf(\"%d\", &n);\n    checkNumber(n);\n    return 0;\n}"
          }
        },
        "samples": [
          {
            "input": "10",
            "output": "Positive\n"
          },
          {
            "input": "-5",
            "output": "Negative\n"
          },
          {
            "input": "0",
            "output": "Zero\n"
          }
        ]
      },
      {
        "part": "b",
        "title": "Looping Statements",
        "problemStatement": "Write a program to demonstrate while and do-while loops.",
        "theory": "Loops are used to execute a block of code repeatedly. The while loop checks the condition before executing the body — if the condition is false initially, the body never executes. The do-while loop executes the body at least once before checking the condition, making it useful when the loop must run at least once regardless of the condition.",
        "algorithm": "1. Start\n2. Read n\n3. Initialize i = 1\n4. While i <= n, print i and increment i\n5. Initialize j = 1\n6. Do: print j and increment j, while j <= n\n7. Stop",
        "flowchart": {
          "nodes": [
            {
              "id": "1",
              "type": "start",
              "label": "Start"
            },
            {
              "id": "2",
              "type": "input",
              "label": "Read n"
            },
            {
              "id": "3",
              "type": "process",
              "label": "i = 1"
            },
            {
              "id": "4",
              "type": "decision",
              "label": "i <= n?"
            },
            {
              "id": "5",
              "type": "output",
              "label": "Print i"
            },
            {
              "id": "6",
              "type": "process",
              "label": "i++"
            },
            {
              "id": "7",
              "type": "process",
              "label": "j = 1"
            },
            {
              "id": "8",
              "type": "output",
              "label": "Print j"
            },
            {
              "id": "9",
              "type": "process",
              "label": "j++"
            },
            {
              "id": "10",
              "type": "decision",
              "label": "j <= n?"
            },
            {
              "id": "11",
              "type": "end",
              "label": "Stop"
            }
          ],
          "edges": [
            {
              "source": "1",
              "target": "2"
            },
            {
              "source": "2",
              "target": "3"
            },
            {
              "source": "3",
              "target": "4"
            },
            {
              "source": "4",
              "target": "5",
              "label": "Yes"
            },
            {
              "source": "5",
              "target": "6"
            },
            {
              "source": "6",
              "target": "4"
            },
            {
              "source": "4",
              "target": "7",
              "label": "No"
            },
            {
              "source": "7",
              "target": "8"
            },
            {
              "source": "8",
              "target": "9"
            },
            {
              "source": "9",
              "target": "10"
            },
            {
              "source": "10",
              "target": "8",
              "label": "Yes"
            },
            {
              "source": "10",
              "target": "11",
              "label": "No"
            }
          ]
        },
        "starterCode": {
          "supportedLanguages": [
            "c"
          ],
          "templates": {
            "c": "#include <stdio.h>\n\nvoid demonstrateLoops(int n) {\n    // Write your code here\n    // Print 1 to n using while loop\n    // Print 1 to n using do-while loop\n}\n\nint main() {\n    int n;\n    scanf(\"%d\", &n);\n    demonstrateLoops(n);\n    return 0;\n}"
          }
        },
        "samples": [
          {
            "input": "5",
            "output": "While loop:\n1 2 3 4 5 \nDo-while loop:\n1 2 3 4 5 \n"
          }
        ]
      }
    ]
  },
  {
    "_id": new ObjectId("685b2a1f3c4e8d0012a7b303"),
    "subjectId": new ObjectId("685b2a1f3c4e8d0012a7b000"),
    "experimentNumber": 3,
    "subExperiments": [
      {
        "part": "a",
        "title": "Switch, Continue, Break, Goto",
        "problemStatement": "Write a program to demonstrate Switch statement, Continue statement, Break statement, and Goto statement.",
        "theory": "Switch statement selects one of many code blocks to execute based on a variable's value. Break exits the nearest loop or switch. Continue skips the rest of the current loop iteration and moves to the next. Goto transfers control unconditionally to a labeled statement — though its use is generally discouraged as it makes code harder to read.",
        "algorithm": "1. Start\n2. Read choice\n3. Switch on choice: case 1 print Monday, case 2 print Tuesday, default print Invalid\n4. Demonstrate break by exiting a loop early\n5. Demonstrate continue by skipping even numbers in a loop\n6. Demonstrate goto by jumping to a label\n7. Stop",
        "flowchart": {
          "nodes": [
            {
              "id": "1",
              "type": "start",
              "label": "Start"
            },
            {
              "id": "2",
              "type": "input",
              "label": "Read choice"
            },
            {
              "id": "3",
              "type": "decision",
              "label": "choice == 1?"
            },
            {
              "id": "4",
              "type": "output",
              "label": "Print Monday"
            },
            {
              "id": "5",
              "type": "decision",
              "label": "choice == 2?"
            },
            {
              "id": "6",
              "type": "output",
              "label": "Print Tuesday"
            },
            {
              "id": "7",
              "type": "output",
              "label": "Print Invalid"
            },
            {
              "id": "8",
              "type": "end",
              "label": "Stop"
            }
          ],
          "edges": [
            {
              "source": "1",
              "target": "2"
            },
            {
              "source": "2",
              "target": "3"
            },
            {
              "source": "3",
              "target": "4",
              "label": "Yes"
            },
            {
              "source": "3",
              "target": "5",
              "label": "No"
            },
            {
              "source": "4",
              "target": "8"
            },
            {
              "source": "5",
              "target": "6",
              "label": "Yes"
            },
            {
              "source": "5",
              "target": "7",
              "label": "No"
            },
            {
              "source": "6",
              "target": "8"
            },
            {
              "source": "7",
              "target": "8"
            }
          ]
        },
        "starterCode": {
          "supportedLanguages": [
            "c"
          ],
          "templates": {
            "c": "#include <stdio.h>\n\nvoid demonstrateControl(int choice) {\n    // Write your code here\n    // Switch on choice (1: Monday, 2: Tuesday, else: Invalid)\n    // Demonstrate break, continue, goto\n}\n\nint main() {\n    int choice;\n    scanf(\"%d\", &choice);\n    demonstrateControl(choice);\n    return 0;\n}"
          }
        },
        "samples": [
          {
            "input": "1",
            "output": "Monday\n0 1 2 3 4 \n1 3 5 7 9 \n"
          }
        ]
      }
    ]
  },
  {
    "_id": new ObjectId("685b2a1f3c4e8d0012a7b304"),
    "subjectId": new ObjectId("685b2a1f3c4e8d0012a7b000"),
    "experimentNumber": 4,
    "subExperiments": [
      {
        "part": "a",
        "title": "Functions with Argument Passing",
        "problemStatement": "Write a program to demonstrate Function definition, call by value, and call by reference.",
        "theory": "A function is a block of code that performs a specific task. In call by value, a copy of the argument is passed so the original variable is not modified. In call by reference, the address of the variable is passed using pointers, so changes inside the function affect the original variable.",
        "algorithm": "1. Start\n2. Define a function swap_by_value(a, b) that swaps copies\n3. Define a function swap_by_reference(a, b) using pointers\n4. Read two numbers x and y\n5. Call swap_by_value(x, y) and show x, y are unchanged\n6. Call swap_by_reference(&x, &y) and show x, y are swapped\n7. Stop",
        "flowchart": {
          "nodes": [
            {
              "id": "1",
              "type": "start",
              "label": "Start"
            },
            {
              "id": "2",
              "type": "input",
              "label": "Read x, y"
            },
            {
              "id": "3",
              "type": "process",
              "label": "Call swap_by_value(x, y)"
            },
            {
              "id": "4",
              "type": "output",
              "label": "Print x, y (unchanged)"
            },
            {
              "id": "5",
              "type": "process",
              "label": "Call swap_by_reference(&x, &y)"
            },
            {
              "id": "6",
              "type": "output",
              "label": "Print x, y (swapped)"
            },
            {
              "id": "7",
              "type": "end",
              "label": "Stop"
            }
          ],
          "edges": [
            {
              "source": "1",
              "target": "2"
            },
            {
              "source": "2",
              "target": "3"
            },
            {
              "source": "3",
              "target": "4"
            },
            {
              "source": "4",
              "target": "5"
            },
            {
              "source": "5",
              "target": "6"
            },
            {
              "source": "6",
              "target": "7"
            }
          ]
        },
        "starterCode": {
          "supportedLanguages": [
            "c"
          ],
          "templates": {
            "c": "#include <stdio.h>\n\nvoid swap_by_value(int a, int b) {\n    // Write your code here\n}\n\nvoid swap_by_reference(int *a, int *b) {\n    // Write your code here\n}\n\nint main() {\n    int x, y;\n    scanf(\"%d %d\", &x, &y);\n    printf(\"Before: x=%d, y=%d\\n\", x, y);\n    swap_by_value(x, y);\n    printf(\"After call by value: x=%d, y=%d\\n\", x, y);\n    swap_by_reference(&x, &y);\n    printf(\"After call by reference: x=%d, y=%d\\n\", x, y);\n    return 0;\n}"
          }
        },
        "samples": [
          {
            "input": "10 20",
            "output": "Before: x=10, y=20\nInside swap_by_value: a=20, b=10\nAfter call by value: x=10, y=20\nAfter call by reference: x=20, y=10\n"
          }
        ]
      }
    ]
  },
  {
    "_id": new ObjectId("685b2a1f3c4e8d0012a7b305"),
    "subjectId": new ObjectId("685b2a1f3c4e8d0012a7b000"),
    "experimentNumber": 5,
    "subExperiments": [
      {
        "part": "a",
        "title": "Iterative Function",
        "problemStatement": "Implement an iterative function for factorial and Fibonacci.",
        "theory": "An iterative function uses loops to repeat operations. Factorial of n (n!) is the product of all positive integers from 1 to n. Fibonacci series is a sequence where each number is the sum of the two preceding ones: 0, 1, 1, 2, 3, 5, 8... Iterative approaches use for or while loops and are generally more memory efficient than recursion.",
        "algorithm": "1. Start\n2. Read n\n3. For factorial: initialize fact = 1, loop from i = 1 to n, multiply fact = fact * i\n4. Display factorial\n5. For Fibonacci: initialize a = 0, b = 1, loop n times, print a, then next = a + b, a = b, b = next\n6. Display Fibonacci series\n7. Stop",
        "flowchart": {
          "nodes": [
            {
              "id": "1",
              "type": "start",
              "label": "Start"
            },
            {
              "id": "2",
              "type": "input",
              "label": "Read n"
            },
            {
              "id": "3",
              "type": "process",
              "label": "fact = 1, i = 1"
            },
            {
              "id": "4",
              "type": "decision",
              "label": "i <= n?"
            },
            {
              "id": "5",
              "type": "process",
              "label": "fact = fact * i, i++"
            },
            {
              "id": "6",
              "type": "output",
              "label": "Print fact"
            },
            {
              "id": "7",
              "type": "process",
              "label": "a = 0, b = 1, i = 0"
            },
            {
              "id": "8",
              "type": "decision",
              "label": "i < n?"
            },
            {
              "id": "9",
              "type": "output",
              "label": "Print a"
            },
            {
              "id": "10",
              "type": "process",
              "label": "next = a+b, a = b, b = next, i++"
            },
            {
              "id": "11",
              "type": "end",
              "label": "Stop"
            }
          ],
          "edges": [
            {
              "source": "1",
              "target": "2"
            },
            {
              "source": "2",
              "target": "3"
            },
            {
              "source": "3",
              "target": "4"
            },
            {
              "source": "4",
              "target": "5",
              "label": "Yes"
            },
            {
              "source": "5",
              "target": "4"
            },
            {
              "source": "4",
              "target": "6",
              "label": "No"
            },
            {
              "source": "6",
              "target": "7"
            },
            {
              "source": "7",
              "target": "8"
            },
            {
              "source": "8",
              "target": "9",
              "label": "Yes"
            },
            {
              "source": "9",
              "target": "10"
            },
            {
              "source": "10",
              "target": "8"
            },
            {
              "source": "8",
              "target": "11",
              "label": "No"
            }
          ]
        },
        "starterCode": {
          "supportedLanguages": [
            "c"
          ],
          "templates": {
            "c": "#include <stdio.h>\n\nlong factorial(int n) {\n    // Write your code here\n    return 1;\n}\n\nvoid fibonacci(int n) {\n    // Write your code here\n}\n\nint main() {\n    int n;\n    scanf(\"%d\", &n);\n    printf(\"Factorial of %d = %ld\\n\", n, factorial(n));\n    printf(\"Fibonacci series: \");\n    fibonacci(n);\n    printf(\"\\n\");\n    return 0;\n}"
          }
        },
        "samples": [
          {
            "input": "5",
            "output": "Factorial of 5 = 120\nFibonacci series: 0 1 1 2 3 \n"
          }
        ]
      },
      {
        "part": "b",
        "title": "Recursive Function",
        "problemStatement": "Implement a recursive function for factorial and Fibonacci.",
        "theory": "Recursion is when a function calls itself to solve smaller instances of the same problem. Every recursive function has a base case (stopping condition) and a recursive case. For factorial: fact(n) = n * fact(n-1), base case fact(0) = 1. For Fibonacci: fib(n) = fib(n-1) + fib(n-2), base cases fib(0) = 0, fib(1) = 1. Recursion uses the call stack and can be less efficient than iteration for large inputs.",
        "algorithm": "1. Start\n2. Read n\n3. For factorial: if n == 0 return 1, else return n * factorial(n-1)\n4. For Fibonacci: if n == 0 return 0, if n == 1 return 1, else return fib(n-1) + fib(n-2)\n5. Display results\n6. Stop",
        "flowchart": {
          "nodes": [
            {
              "id": "1",
              "type": "start",
              "label": "Start"
            },
            {
              "id": "2",
              "type": "input",
              "label": "Read n"
            },
            {
              "id": "3",
              "type": "decision",
              "label": "n == 0?"
            },
            {
              "id": "4",
              "type": "output",
              "label": "Return 1"
            },
            {
              "id": "5",
              "type": "process",
              "label": "Return n * factorial(n-1)"
            },
            {
              "id": "6",
              "type": "output",
              "label": "Print factorial"
            },
            {
              "id": "7",
              "type": "end",
              "label": "Stop"
            }
          ],
          "edges": [
            {
              "source": "1",
              "target": "2"
            },
            {
              "source": "2",
              "target": "3"
            },
            {
              "source": "3",
              "target": "4",
              "label": "Yes"
            },
            {
              "source": "3",
              "target": "5",
              "label": "No"
            },
            {
              "source": "4",
              "target": "6"
            },
            {
              "source": "5",
              "target": "6"
            },
            {
              "source": "6",
              "target": "7"
            }
          ]
        },
        "starterCode": {
          "supportedLanguages": [
            "c"
          ],
          "templates": {
            "c": "#include <stdio.h>\n\nlong factorial(int n) {\n    // Write your code here (Recursive)\n    return 1;\n}\n\nint fibonacci(int n) {\n    // Write your code here (Recursive)\n    return 0;\n}\n\nint main() {\n    int n;\n    scanf(\"%d\", &n);\n    printf(\"Factorial of %d = %ld\\n\", n, factorial(n));\n    printf(\"Fibonacci(%d) = %d\\n\", n, fibonacci(n));\n    return 0;\n}"
          }
        },
        "samples": [
          {
            "input": "5",
            "output": "Factorial of 5 = 120\nFibonacci(5) = 5\n"
          }
        ]
      }
    ]
  },
  {
    "_id": new ObjectId("685b2a1f3c4e8d0012a7b306"),
    "subjectId": new ObjectId("685b2a1f3c4e8d0012a7b000"),
    "experimentNumber": 6,
    "subExperiments": [
      {
        "part": "a",
        "title": "Auto, Extern, Static, Register",
        "problemStatement": "Write a program to demonstrate Auto, Extern, Static, and Register storage classes.",
        "theory": "Storage classes define the scope, lifetime, and visibility of variables. Auto is the default for local variables, created and destroyed with the function. Extern declares a variable defined in another file or globally. Static preserves the variable's value between function calls and limits scope to the file. Register suggests storing the variable in a CPU register for faster access.",
        "algorithm": "1. Start\n2. Demonstrate auto variable inside a function\n3. Demonstrate static variable that retains its value across calls\n4. Demonstrate extern variable shared across files\n5. Demonstrate register variable for fast access\n6. Display results\n7. Stop",
        "flowchart": {
          "nodes": [
            {
              "id": "1",
              "type": "start",
              "label": "Start"
            },
            {
              "id": "2",
              "type": "process",
              "label": "auto int x = 10"
            },
            {
              "id": "3",
              "type": "process",
              "label": "static int count = 0; count++"
            },
            {
              "id": "4",
              "type": "process",
              "label": "register int r = 5"
            },
            {
              "id": "5",
              "type": "output",
              "label": "Display all variables"
            },
            {
              "id": "6",
              "type": "end",
              "label": "Stop"
            }
          ],
          "edges": [
            {
              "source": "1",
              "target": "2"
            },
            {
              "source": "2",
              "target": "3"
            },
            {
              "source": "3",
              "target": "4"
            },
            {
              "source": "4",
              "target": "5"
            },
            {
              "source": "5",
              "target": "6"
            }
          ]
        },
        "starterCode": {
          "supportedLanguages": [
            "c"
          ],
          "templates": {
            "c": "#include <stdio.h>\n\nvoid demonstrate_storage() {\n    // Write your code here to demonstrate auto, static, register, extern\n}\n\nint main() {\n    demonstrate_storage();\n    return 0;\n}"
          }
        },
        "samples": [
          {
            "input": "",
            "output": "Auto x: 10\nStatic count: 1\nStatic count: 2\nStatic count: 3\nRegister r: 5\n"
          }
        ]
      }
    ]
  },
  {
    "_id": new ObjectId("685b2a1f3c4e8d0012a7b307"),
    "subjectId": new ObjectId("685b2a1f3c4e8d0012a7b000"),
    "experimentNumber": 7,
    "subExperiments": [
      {
        "part": "c",
        "title": "1D Array",
        "problemStatement": "Write a program to demonstrate 1D Array operations in C.",
        "theory": "A 1D array is a collection of elements of the same data type stored in contiguous memory locations. Elements are accessed using an index starting from 0. Common operations include traversal, insertion, deletion, searching, and sorting.",
        "algorithm": "1. Start\n2. Declare array of size n\n3. Read n elements into the array\n4. Traverse and display all elements\n5. Search for an element using linear search\n6. Sort the array using bubble sort\n7. Display sorted array\n8. Stop",
        "flowchart": {
          "nodes": [
            {
              "id": "1",
              "type": "start",
              "label": "Start"
            },
            {
              "id": "2",
              "type": "input",
              "label": "Read n"
            },
            {
              "id": "3",
              "type": "input",
              "label": "Read n elements"
            },
            {
              "id": "4",
              "type": "output",
              "label": "Display elements"
            },
            {
              "id": "5",
              "type": "process",
              "label": "Sort array"
            },
            {
              "id": "6",
              "type": "output",
              "label": "Display sorted array"
            },
            {
              "id": "7",
              "type": "end",
              "label": "Stop"
            }
          ],
          "edges": [
            {
              "source": "1",
              "target": "2"
            },
            {
              "source": "2",
              "target": "3"
            },
            {
              "source": "3",
              "target": "4"
            },
            {
              "source": "4",
              "target": "5"
            },
            {
              "source": "5",
              "target": "6"
            },
            {
              "source": "6",
              "target": "7"
            }
          ]
        },
        "starterCode": {
          "supportedLanguages": [
            "c"
          ],
          "templates": {
            "c": "#include <stdio.h>\n\nvoid process1D(int n, int arr[]) {\n    // Write your code here (Traverse, search, sort array)\n}\n\nint main() {\n    int n;\n    scanf(\"%d\", &n);\n    int arr[n];\n    for (int i = 0; i < n; i++) scanf(\"%d\", &arr[i]);\n    process1D(n, arr);\n    return 0;\n}"
          }
        },
        "samples": [
          {
            "input": "5\n4 1 3 5 2",
            "output": "Array: 4 1 3 5 2 \nSorted Array: 1 2 3 4 5 \n"
          }
        ]
      },
      {
        "part": "d",
        "title": "2D Array",
        "problemStatement": "Write a program to demonstrate 2D Array (Matrix) operations in C.",
        "theory": "A 2D array is an array of arrays, representing a matrix with rows and columns. Elements are accessed using two indices arr[row][col]. Common operations include matrix addition, subtraction, multiplication, and transpose.",
        "algorithm": "1. Start\n2. Read dimensions m x n for two matrices A and B\n3. Read elements of matrix A\n4. Read elements of matrix B\n5. Add matrices A and B to get C\n6. Display matrix C\n7. Multiply matrices if dimensions allow\n8. Stop",
        "flowchart": {
          "nodes": [
            {
              "id": "1",
              "type": "start",
              "label": "Start"
            },
            {
              "id": "2",
              "type": "input",
              "label": "Read m, n"
            },
            {
              "id": "3",
              "type": "input",
              "label": "Read matrix A"
            },
            {
              "id": "4",
              "type": "input",
              "label": "Read matrix B"
            },
            {
              "id": "5",
              "type": "process",
              "label": "C[i][j] = A[i][j] + B[i][j]"
            },
            {
              "id": "6",
              "type": "output",
              "label": "Display matrix C"
            },
            {
              "id": "7",
              "type": "end",
              "label": "Stop"
            }
          ],
          "edges": [
            {
              "source": "1",
              "target": "2"
            },
            {
              "source": "2",
              "target": "3"
            },
            {
              "source": "3",
              "target": "4"
            },
            {
              "source": "4",
              "target": "5"
            },
            {
              "source": "5",
              "target": "6"
            },
            {
              "source": "6",
              "target": "7"
            }
          ]
        },
        "starterCode": {
          "supportedLanguages": [
            "c"
          ],
          "templates": {
            "c": "#include <stdio.h>\n\nvoid process2D(int m, int n, int A[100][100], int B[100][100]) {\n    // Write your code here (Addition, Multiplication)\n}\n\nint main() {\n    int m, n;\n    scanf(\"%d %d\", &m, &n);\n    int A[100][100], B[100][100];\n    for(int i=0; i<m; i++) for(int j=0; j<n; j++) scanf(\"%d\", &A[i][j]);\n    for(int i=0; i<m; i++) for(int j=0; j<n; j++) scanf(\"%d\", &B[i][j]);\n    process2D(m, n, A, B);\n    return 0;\n}"
          }
        },
        "samples": [
          {
            "input": "2 2\n1 2\n3 4\n5 6\n7 8",
            "output": "Sum matrix:\n6 8 \n10 12 \n"
          }
        ]
      }
    ]
  },
  {
    "_id": new ObjectId("685b2a1f3c4e8d0012a7b308"),
    "subjectId": new ObjectId("685b2a1f3c4e8d0012a7b000"),
    "experimentNumber": 8,
    "subExperiments": [
      {
        "part": "e",
        "title": "String Operations",
        "problemStatement": "Write a program to demonstrate String operations in C.",
        "theory": "Strings in C are arrays of characters terminated by a null character '\\0'. The string.h library provides functions like strlen() for length, strcpy() for copying, strcat() for concatenation, strcmp() for comparison, and strrev() for reversing a string.",
        "algorithm": "1. Start\n2. Read a string s\n3. Find length using strlen()\n4. Copy to another string using strcpy()\n5. Concatenate two strings using strcat()\n6. Compare two strings using strcmp()\n7. Display results\n8. Stop",
        "flowchart": {
          "nodes": [
            {
              "id": "1",
              "type": "start",
              "label": "Start"
            },
            {
              "id": "2",
              "type": "input",
              "label": "Read string s1, s2"
            },
            {
              "id": "3",
              "type": "process",
              "label": "len = strlen(s1)"
            },
            {
              "id": "4",
              "type": "process",
              "label": "strcpy(dest, s1)"
            },
            {
              "id": "5",
              "type": "process",
              "label": "strcat(s1, s2)"
            },
            {
              "id": "6",
              "type": "process",
              "label": "cmp = strcmp(s1, s2)"
            },
            {
              "id": "7",
              "type": "output",
              "label": "Display all results"
            },
            {
              "id": "8",
              "type": "end",
              "label": "Stop"
            }
          ],
          "edges": [
            {
              "source": "1",
              "target": "2"
            },
            {
              "source": "2",
              "target": "3"
            },
            {
              "source": "3",
              "target": "4"
            },
            {
              "source": "4",
              "target": "5"
            },
            {
              "source": "5",
              "target": "6"
            },
            {
              "source": "6",
              "target": "7"
            },
            {
              "source": "7",
              "target": "8"
            }
          ]
        },
        "starterCode": {
          "supportedLanguages": [
            "c"
          ],
          "templates": {
            "c": "#include <stdio.h>\n#include <string.h>\n\nvoid stringOps(char* s1, char* s2) {\n    // Write your code here (length, copy, concat, compare)\n}\n\nint main() {\n    char s1[100], s2[100];\n    scanf(\"%s %s\", s1, s2);\n    stringOps(s1, s2);\n    return 0;\n}"
          }
        },
        "samples": [
          {
            "input": "Hello World",
            "output": "Length of s1: 5\nCopied: Hello\nConcatenated: HelloWorld\nComparison: -15\n"
          }
        ]
      },
      {
        "part": "f",
        "title": "Array of Strings",
        "problemStatement": "Write a program to demonstrate arrays of strings in C.",
        "theory": "An array of strings in C is a 2D character array where each row is a string. It can be declared as char arr[n][max_len]. Alternatively, an array of character pointers can be used. Common operations include reading, displaying, sorting, and searching strings in the array.",
        "algorithm": "1. Start\n2. Declare array of strings with n rows\n3. Read n strings\n4. Display all strings\n5. Sort strings alphabetically using strcmp()\n6. Display sorted strings\n7. Stop",
        "flowchart": {
          "nodes": [
            {
              "id": "1",
              "type": "start",
              "label": "Start"
            },
            {
              "id": "2",
              "type": "input",
              "label": "Read n"
            },
            {
              "id": "3",
              "type": "input",
              "label": "Read n strings"
            },
            {
              "id": "4",
              "type": "output",
              "label": "Display strings"
            },
            {
              "id": "5",
              "type": "process",
              "label": "Sort using strcmp()"
            },
            {
              "id": "6",
              "type": "output",
              "label": "Display sorted strings"
            },
            {
              "id": "7",
              "type": "end",
              "label": "Stop"
            }
          ],
          "edges": [
            {
              "source": "1",
              "target": "2"
            },
            {
              "source": "2",
              "target": "3"
            },
            {
              "source": "3",
              "target": "4"
            },
            {
              "source": "4",
              "target": "5"
            },
            {
              "source": "5",
              "target": "6"
            },
            {
              "source": "6",
              "target": "7"
            }
          ]
        },
        "starterCode": {
          "supportedLanguages": [
            "c"
          ],
          "templates": {
            "c": "#include <stdio.h>\n#include <string.h>\n\nvoid sortStrings(int n, char arr[][100]) {\n    // Write your code here (Sort array of strings alphabetically)\n}\n\nint main() {\n    int n;\n    scanf(\"%d\", &n);\n    char arr[n][100];\n    for (int i = 0; i < n; i++) scanf(\"%s\", arr[i]);\n    sortStrings(n, arr);\n    for (int i = 0; i < n; i++) printf(\"%s\\n\", arr[i]);\n    return 0;\n}"
          }
        },
        "samples": [
          {
            "input": "3\nZebra\nApple\nMango",
            "output": "Strings entered:\nZebra\nApple\nMango\nSorted strings:\nApple\nMango\nZebra\n"
          }
        ]
      }
    ]
  },
  {
    "_id": new ObjectId("685b2a1f3c4e8d0012a7b309"),
    "subjectId": new ObjectId("685b2a1f3c4e8d0012a7b000"),
    "experimentNumber": 9,
    "subExperiments": [
      {
        "part": "a",
        "title": "Define a Structure",
        "problemStatement": "Define a structure to hold student or employee details.",
        "theory": "A structure in C is a user-defined data type that groups variables of different types under a single name. It is defined using the struct keyword. Each variable inside a structure is called a member and is accessed using the dot (.) operator.",
        "algorithm": "1. Start\n2. Define a struct Student with fields: id, name, marks\n3. Declare a variable of type struct Student\n4. Display the structure definition\n5. Stop",
        "flowchart": {
          "nodes": [
            {
              "id": "1",
              "type": "start",
              "label": "Start"
            },
            {
              "id": "2",
              "type": "process",
              "label": "Define struct Student { id, name, marks }"
            },
            {
              "id": "3",
              "type": "process",
              "label": "Declare struct Student s"
            },
            {
              "id": "4",
              "type": "output",
              "label": "Display structure fields"
            },
            {
              "id": "5",
              "type": "end",
              "label": "Stop"
            }
          ],
          "edges": [
            {
              "source": "1",
              "target": "2"
            },
            {
              "source": "2",
              "target": "3"
            },
            {
              "source": "3",
              "target": "4"
            },
            {
              "source": "4",
              "target": "5"
            }
          ]
        },
        "starterCode": {
          "supportedLanguages": [
            "c"
          ],
          "templates": {
            "c": "#include <stdio.h>\n\n// Define struct Student here with id, name, marks\n\nint main() {\n    // Declare struct Student s and demonstrate it\n    return 0;\n}"
          }
        },
        "samples": [
          {
            "input": "",
            "output": "Structure defined successfully."
          }
        ]
      },
      {
        "part": "b",
        "title": "Read and Store Details",
        "problemStatement": "Read and store student/employee details into the structure.",
        "theory": "After defining a structure, we can read values from the user and store them into the structure members using scanf() for numeric values and scanf() or fgets() for strings. An array of structures can store multiple records.",
        "algorithm": "1. Start\n2. Define struct Student\n3. Declare array of n students\n4. For each student, read id, name, and marks\n5. Store into structure array\n6. Stop",
        "flowchart": {
          "nodes": [
            {
              "id": "1",
              "type": "start",
              "label": "Start"
            },
            {
              "id": "2",
              "type": "input",
              "label": "Read n"
            },
            {
              "id": "3",
              "type": "process",
              "label": "i = 0"
            },
            {
              "id": "4",
              "type": "decision",
              "label": "i < n?"
            },
            {
              "id": "5",
              "type": "input",
              "label": "Read student[i] details"
            },
            {
              "id": "6",
              "type": "process",
              "label": "i++"
            },
            {
              "id": "7",
              "type": "end",
              "label": "Stop"
            }
          ],
          "edges": [
            {
              "source": "1",
              "target": "2"
            },
            {
              "source": "2",
              "target": "3"
            },
            {
              "source": "3",
              "target": "4"
            },
            {
              "source": "4",
              "target": "5",
              "label": "Yes"
            },
            {
              "source": "5",
              "target": "6"
            },
            {
              "source": "6",
              "target": "4"
            },
            {
              "source": "4",
              "target": "7",
              "label": "No"
            }
          ]
        },
        "starterCode": {
          "supportedLanguages": [
            "c"
          ],
          "templates": {
            "c": "#include <stdio.h>\n\nstruct Student { int id; char name[50]; float marks; };\n\nvoid readStudents(int n, struct Student students[]) {\n    // Write your code here to read and store details\n}\n\nint main() {\n    int n;\n    scanf(\"%d\", &n);\n    struct Student students[n];\n    readStudents(n, students);\n    return 0;\n}"
          }
        },
        "samples": [
          {
            "input": "2\n1 Alice 95.5\n2 Bob 88.0",
            "output": "Records stored successfully.\n"
          }
        ]
      },
      {
        "part": "c",
        "title": "Display Stored Information",
        "problemStatement": "Display the stored student/employee information from the structure.",
        "theory": "Once data is stored in a structure or array of structures, it can be displayed by accessing each member using the dot operator. We iterate through the array and print each student's details in a formatted manner.",
        "algorithm": "1. Start\n2. Read and store n student records\n3. Loop from i = 0 to n-1\n4. Print student[i].id, student[i].name, student[i].marks\n5. Stop",
        "flowchart": {
          "nodes": [
            {
              "id": "1",
              "type": "start",
              "label": "Start"
            },
            {
              "id": "2",
              "type": "process",
              "label": "i = 0"
            },
            {
              "id": "3",
              "type": "decision",
              "label": "i < n?"
            },
            {
              "id": "4",
              "type": "output",
              "label": "Print student[i] details"
            },
            {
              "id": "5",
              "type": "process",
              "label": "i++"
            },
            {
              "id": "6",
              "type": "end",
              "label": "Stop"
            }
          ],
          "edges": [
            {
              "source": "1",
              "target": "2"
            },
            {
              "source": "2",
              "target": "3"
            },
            {
              "source": "3",
              "target": "4",
              "label": "Yes"
            },
            {
              "source": "4",
              "target": "5"
            },
            {
              "source": "5",
              "target": "3"
            },
            {
              "source": "3",
              "target": "6",
              "label": "No"
            }
          ]
        },
        "starterCode": {
          "supportedLanguages": [
            "c"
          ],
          "templates": {
            "c": "#include <stdio.h>\n\nstruct Student { int id; char name[50]; float marks; };\n\nvoid displayStudents(int n, struct Student students[]) {\n    // Write your code here to display stored details\n}\n\nint main() {\n    int n;\n    scanf(\"%d\", &n);\n    struct Student students[n];\n    for (int i = 0; i < n; i++) scanf(\"%d %s %f\", &students[i].id, students[i].name, &students[i].marks);\n    displayStudents(n, students);\n    return 0;\n}"
          }
        },
        "samples": [
          {
            "input": "2\n1 Alice 95.5\n2 Bob 88.0",
            "output": "\nID    Name                 Marks     \n1     Alice                95.50     \n2     Bob                  88.00     \n"
          }
        ]
      }
    ]
  },
  {
    "_id": new ObjectId("685b2a1f3c4e8d0012a7b310"),
    "subjectId": new ObjectId("685b2a1f3c4e8d0012a7b000"),
    "experimentNumber": 10,
    "subExperiments": [
      {
        "part": "a",
        "title": "Define a Node Structure",
        "problemStatement": "Define a node structure with a data field and a pointer to the next node.",
        "theory": "A linked list is a linear data structure where each element (node) contains data and a pointer to the next node. Unlike arrays, linked lists do not require contiguous memory. Each node is dynamically allocated using malloc().",
        "algorithm": "1. Start\n2. Define struct Node with int data and struct Node* next\n3. Declare a head pointer initialized to NULL\n4. Stop",
        "flowchart": {
          "nodes": [
            {
              "id": "1",
              "type": "start",
              "label": "Start"
            },
            {
              "id": "2",
              "type": "process",
              "label": "Define struct Node { data, *next }"
            },
            {
              "id": "3",
              "type": "process",
              "label": "head = NULL"
            },
            {
              "id": "4",
              "type": "end",
              "label": "Stop"
            }
          ],
          "edges": [
            {
              "source": "1",
              "target": "2"
            },
            {
              "source": "2",
              "target": "3"
            },
            {
              "source": "3",
              "target": "4"
            }
          ]
        },
        "starterCode": {
          "supportedLanguages": [
            "c"
          ],
          "templates": {
            "c": "#include <stdio.h>\n#include <stdlib.h>\n\n// Define struct Node with int data and struct Node* next\n\nint main() {\n    // Declare head pointer and initialize to NULL\n    return 0;\n}"
          }
        },
        "samples": [
          {
            "input": "",
            "output": "Node structure defined.\n"
          }
        ]
      },
      {
        "part": "b",
        "title": "Insert, Delete, and Display Nodes",
        "problemStatement": "Implement functions to insert, delete, and display nodes in a linked list.",
        "theory": "Insertion adds a new node at the beginning, end, or a specific position. Deletion removes a node by locating it and updating pointers. Display traverses from head to NULL printing each node's data. All operations rely on pointer manipulation and dynamic memory allocation with malloc() and free().",
        "algorithm": "1. Start\n2. To insert: allocate new node, set data, point next to head, update head\n3. To delete: traverse to find node, update previous node's next to skip deleted node, free memory\n4. To display: traverse from head to NULL, print each node's data\n5. Stop",
        "flowchart": {
          "nodes": [
            {
              "id": "1",
              "type": "start",
              "label": "Start"
            },
            {
              "id": "2",
              "type": "process",
              "label": "newNode = malloc(sizeof(Node))"
            },
            {
              "id": "3",
              "type": "process",
              "label": "newNode->data = val, newNode->next = head"
            },
            {
              "id": "4",
              "type": "process",
              "label": "head = newNode"
            },
            {
              "id": "5",
              "type": "decision",
              "label": "Delete node?"
            },
            {
              "id": "6",
              "type": "process",
              "label": "Traverse to find node, update pointers, free()"
            },
            {
              "id": "7",
              "type": "output",
              "label": "Display all nodes"
            },
            {
              "id": "8",
              "type": "end",
              "label": "Stop"
            }
          ],
          "edges": [
            {
              "source": "1",
              "target": "2"
            },
            {
              "source": "2",
              "target": "3"
            },
            {
              "source": "3",
              "target": "4"
            },
            {
              "source": "4",
              "target": "5"
            },
            {
              "source": "5",
              "target": "6",
              "label": "Yes"
            },
            {
              "source": "5",
              "target": "7",
              "label": "No"
            },
            {
              "source": "6",
              "target": "7"
            },
            {
              "source": "7",
              "target": "8"
            }
          ]
        },
        "starterCode": {
          "supportedLanguages": [
            "c"
          ],
          "templates": {
            "c": "#include <stdio.h>\n#include <stdlib.h>\n\nstruct Node { int data; struct Node* next; };\n\nvoid insert(struct Node** head, int val) {\n    // Write your code here\n}\n\nvoid deleteNode(struct Node** head, int val) {\n    // Write your code here\n}\n\nvoid display(struct Node* head) {\n    // Write your code here\n}\n\nint main() {\n    struct Node* head = NULL;\n    insert(&head, 10);\n    insert(&head, 20);\n    insert(&head, 30);\n    display(head);\n    deleteNode(&head, 20);\n    display(head);\n    return 0;\n}"
          }
        },
        "samples": [
          {
            "input": "",
            "output": "30 -> 20 -> 10 -> NULL\n30 -> 10 -> NULL\n"
          }
        ]
      }
    ]
  },
  {
    "_id": new ObjectId("685b2a1f3c4e8d0012a7b311"),
    "subjectId": new ObjectId("685b2a1f3c4e8d0012a7b000"),
    "experimentNumber": 11,
    "subExperiments": [
      {
        "part": "a",
        "title": "Open a File to Store Student Records",
        "problemStatement": "Write a program to open a file and store student records.",
        "theory": "File handling in C allows data to be stored permanently. fopen() opens a file with modes like 'r' (read), 'w' (write), 'a' (append). fprintf() writes formatted data to a file. fclose() closes the file. If fopen() returns NULL, the file could not be opened.",
        "algorithm": "1. Start\n2. Open file students.txt in write mode using fopen()\n3. If file is NULL, print error and exit\n4. Read student details from user\n5. Write details to file using fprintf()\n6. Close file using fclose()\n7. Stop",
        "flowchart": {
          "nodes": [
            {
              "id": "1",
              "type": "start",
              "label": "Start"
            },
            {
              "id": "2",
              "type": "process",
              "label": "fp = fopen('students.txt', 'w')"
            },
            {
              "id": "3",
              "type": "decision",
              "label": "fp == NULL?"
            },
            {
              "id": "4",
              "type": "output",
              "label": "Print error, exit"
            },
            {
              "id": "5",
              "type": "input",
              "label": "Read student details"
            },
            {
              "id": "6",
              "type": "process",
              "label": "fprintf(fp, details)"
            },
            {
              "id": "7",
              "type": "process",
              "label": "fclose(fp)"
            },
            {
              "id": "8",
              "type": "end",
              "label": "Stop"
            }
          ],
          "edges": [
            {
              "source": "1",
              "target": "2"
            },
            {
              "source": "2",
              "target": "3"
            },
            {
              "source": "3",
              "target": "4",
              "label": "Yes"
            },
            {
              "source": "3",
              "target": "5",
              "label": "No"
            },
            {
              "source": "5",
              "target": "6"
            },
            {
              "source": "6",
              "target": "7"
            },
            {
              "source": "7",
              "target": "8"
            }
          ]
        },
        "starterCode": {
          "supportedLanguages": [
            "c"
          ],
          "templates": {
            "c": "#include <stdio.h>\n\nvoid writeStudent(int id, char* name, float marks) {\n    // Write your code here to open students.txt and write data\n}\n\nint main() {\n    int id;\n    char name[50];\n    float marks;\n    scanf(\"%d %s %f\", &id, name, &marks);\n    writeStudent(id, name, marks);\n    return 0;\n}"
          }
        },
        "samples": [
          {
            "input": "1 Alice 95.5",
            "output": "Record saved.\n"
          }
        ]
      },
      {
        "part": "b",
        "title": "Add, Update, and Display Records",
        "problemStatement": "Implement functions to add, update, and display student records from a file.",
        "theory": "Records can be added to a file opened in append mode ('a'). To update, all records are read into memory, the target record is modified, and all records are written back. To display, the file is opened in read mode and records are read using fscanf() until EOF.",
        "algorithm": "1. Start\n2. To add: open in append mode, write new record, close\n3. To display: open in read mode, read and print each record until EOF, close\n4. To update: read all records into array, find and modify target, write all back\n5. Stop",
        "flowchart": {
          "nodes": [
            {
              "id": "1",
              "type": "start",
              "label": "Start"
            },
            {
              "id": "2",
              "type": "process",
              "label": "fp = fopen('students.txt', 'a')"
            },
            {
              "id": "3",
              "type": "input",
              "label": "Read new record"
            },
            {
              "id": "4",
              "type": "process",
              "label": "fprintf(fp, record)"
            },
            {
              "id": "5",
              "type": "process",
              "label": "fclose(fp)"
            },
            {
              "id": "6",
              "type": "process",
              "label": "fp = fopen('students.txt', 'r')"
            },
            {
              "id": "7",
              "type": "decision",
              "label": "fscanf != EOF?"
            },
            {
              "id": "8",
              "type": "output",
              "label": "Print record"
            },
            {
              "id": "9",
              "type": "end",
              "label": "Stop"
            }
          ],
          "edges": [
            {
              "source": "1",
              "target": "2"
            },
            {
              "source": "2",
              "target": "3"
            },
            {
              "source": "3",
              "target": "4"
            },
            {
              "source": "4",
              "target": "5"
            },
            {
              "source": "5",
              "target": "6"
            },
            {
              "source": "6",
              "target": "7"
            },
            {
              "source": "7",
              "target": "8",
              "label": "Yes"
            },
            {
              "source": "8",
              "target": "7"
            },
            {
              "source": "7",
              "target": "9",
              "label": "No"
            }
          ]
        },
        "starterCode": {
          "supportedLanguages": [
            "c"
          ],
          "templates": {
            "c": "#include <stdio.h>\n\nvoid addRecord() { \n    // Write code to append to file\n}\n\nvoid displayRecords() { \n    // Write code to read from file\n}\n\nint main() {\n    // Demonstration\n    addRecord();\n    displayRecords();\n    return 0;\n}"
          }
        },
        "samples": [
          {
            "input": "1 Alice 95.5",
            "output": "\nID   Name         Marks\n1    Alice           95.50\n"
          }
        ]
      },
      {
        "part": "c",
        "title": "Ensure Data Persistence",
        "problemStatement": "Ensure data persistence by saving changes to the file after every operation.",
        "theory": "Data persistence means that data survives after the program ends. In C, this is achieved by always writing changes back to the file immediately after any operation. Using fflush() ensures the buffer is flushed to disk. Opening in correct modes and always closing the file ensures no data loss.",
        "algorithm": "1. Start\n2. After every add/update/delete operation, open file in write mode\n3. Write all current records to the file\n4. Call fflush() to force write to disk\n5. Close the file\n6. Stop",
        "flowchart": {
          "nodes": [
            {
              "id": "1",
              "type": "start",
              "label": "Start"
            },
            {
              "id": "2",
              "type": "process",
              "label": "Perform operation (add/update/delete)"
            },
            {
              "id": "3",
              "type": "process",
              "label": "fp = fopen('students.txt', 'w')"
            },
            {
              "id": "4",
              "type": "process",
              "label": "Write all records to fp"
            },
            {
              "id": "5",
              "type": "process",
              "label": "fflush(fp)"
            },
            {
              "id": "6",
              "type": "process",
              "label": "fclose(fp)"
            },
            {
              "id": "7",
              "type": "end",
              "label": "Stop"
            }
          ],
          "edges": [
            {
              "source": "1",
              "target": "2"
            },
            {
              "source": "2",
              "target": "3"
            },
            {
              "source": "3",
              "target": "4"
            },
            {
              "source": "4",
              "target": "5"
            },
            {
              "source": "5",
              "target": "6"
            },
            {
              "source": "6",
              "target": "7"
            }
          ]
        },
        "starterCode": {
          "supportedLanguages": [
            "c"
          ],
          "templates": {
            "c": "#include <stdio.h>\n\nstruct Student { int id; char name[50]; float marks; };\n\nvoid saveAll(struct Student s[], int n) {\n    // Write your code here to ensure data persistence with fflush\n}\n\nint main() {\n    struct Student students[100];\n    // Demonstrate persistence\n    return 0;\n}"
          }
        },
        "samples": [
          {
            "input": "",
            "output": "Data persistence demonstrated.\n"
          }
        ]
      }
    ]
  },
  {
    "_id": new ObjectId("685b2a1f3c4e8d0012a7b312"),
    "subjectId": new ObjectId("685b2a1f3c4e8d0012a7b000"),
    "experimentNumber": 12,
    "subExperiments": [
      {
        "part": "1",
        "title": "Functions – Add, Display, Search Books",
        "problemStatement": "Implement functions to add, display, and search books in the library.",
        "theory": "Functions improve modularity and reusability. In a library management system, separate functions handle adding a book to the list, displaying all books, and searching by title or ID. Each function operates on the shared book array passed as a parameter.",
        "algorithm": "1. Start\n2. Define addBook() to read and store a book record\n3. Define displayBooks() to print all book records\n4. Define searchBook() to find a book by title using strcmp()\n5. Call each function from main()\n6. Stop",
        "flowchart": {
          "nodes": [
            {
              "id": "1",
              "type": "start",
              "label": "Start"
            },
            {
              "id": "2",
              "type": "process",
              "label": "Call addBook()"
            },
            {
              "id": "3",
              "type": "process",
              "label": "Call displayBooks()"
            },
            {
              "id": "4",
              "type": "input",
              "label": "Read search title"
            },
            {
              "id": "5",
              "type": "process",
              "label": "Call searchBook(title)"
            },
            {
              "id": "6",
              "type": "decision",
              "label": "Found?"
            },
            {
              "id": "7",
              "type": "output",
              "label": "Display book details"
            },
            {
              "id": "8",
              "type": "output",
              "label": "Print Not Found"
            },
            {
              "id": "9",
              "type": "end",
              "label": "Stop"
            }
          ],
          "edges": [
            {
              "source": "1",
              "target": "2"
            },
            {
              "source": "2",
              "target": "3"
            },
            {
              "source": "3",
              "target": "4"
            },
            {
              "source": "4",
              "target": "5"
            },
            {
              "source": "5",
              "target": "6"
            },
            {
              "source": "6",
              "target": "7",
              "label": "Yes"
            },
            {
              "source": "6",
              "target": "8",
              "label": "No"
            },
            {
              "source": "7",
              "target": "9"
            },
            {
              "source": "8",
              "target": "9"
            }
          ]
        },
        "starterCode": {
          "supportedLanguages": [
            "c"
          ],
          "templates": {
            "c": "#include <stdio.h>\n#include <string.h>\n\nstruct Book { int id; char title[100]; char author[50]; float price; };\nstruct Book books[100];\nint count = 0;\n\nvoid addBook() { \n    // Write your code here\n}\n\nvoid displayBooks() { \n    // Write your code here\n}\n\nvoid searchBook(char title[]) { \n    // Write your code here\n}\n\nint main() {\n    addBook();\n    displayBooks();\n    return 0;\n}"
          }
        },
        "samples": [
          {
            "input": "1 C_Programming Kernighan 299.0",
            "output": "1 | C_Programming | Kernighan | 299.00\n"
          }
        ]
      },
      {
        "part": "2",
        "title": "Files – Store and Retrieve Book Data",
        "problemStatement": "Use file handling to store and retrieve book data persistently.",
        "theory": "File handling ensures book data is not lost when the program exits. Books are written to a binary or text file using fwrite() or fprintf(). On startup, existing records are loaded using fread() or fscanf(). This gives the library system persistent storage.",
        "algorithm": "1. Start\n2. On startup, open file in read mode and load existing books\n3. After adding a book, open file in write mode and save all books\n4. To display, read from file and print each record\n5. Close file after each operation\n6. Stop",
        "flowchart": {
          "nodes": [
            {
              "id": "1",
              "type": "start",
              "label": "Start"
            },
            {
              "id": "2",
              "type": "process",
              "label": "Load books from file"
            },
            {
              "id": "3",
              "type": "process",
              "label": "Add new book to array"
            },
            {
              "id": "4",
              "type": "process",
              "label": "Save all books to file"
            },
            {
              "id": "5",
              "type": "output",
              "label": "Display books"
            },
            {
              "id": "6",
              "type": "end",
              "label": "Stop"
            }
          ],
          "edges": [
            {
              "source": "1",
              "target": "2"
            },
            {
              "source": "2",
              "target": "3"
            },
            {
              "source": "3",
              "target": "4"
            },
            {
              "source": "4",
              "target": "5"
            },
            {
              "source": "5",
              "target": "6"
            }
          ]
        },
        "starterCode": {
          "supportedLanguages": [
            "c"
          ],
          "templates": {
            "c": "#include <stdio.h>\n\nstruct Book { int id; char title[100]; char author[50]; float price; };\n\nvoid saveBooks(struct Book books[], int count) { \n    // Write your code here\n}\n\nint loadBooks(struct Book books[]) { \n    // Write your code here\n    return 0; \n}\n\nint main() {\n    struct Book books[100];\n    int count = loadBooks(books);\n    return 0;\n}"
          }
        },
        "samples": [
          {
            "input": "",
            "output": "Books loaded and saved.\n"
          }
        ]
      },
      {
        "part": "3",
        "title": "Structures – Represent a Book",
        "problemStatement": "Define a structure to represent a book with relevant fields.",
        "theory": "A structure groups related data together. For a library system, a Book structure contains fields like id (int), title (char array), author (char array), and price (float). Using typedef makes the struct easier to reference throughout the code.",
        "algorithm": "1. Start\n2. Define struct Book with id, title, author, price\n3. Use typedef for convenience\n4. Declare a Book variable and initialize it\n5. Display the book details\n6. Stop",
        "flowchart": {
          "nodes": [
            {
              "id": "1",
              "type": "start",
              "label": "Start"
            },
            {
              "id": "2",
              "type": "process",
              "label": "Define typedef struct Book"
            },
            {
              "id": "3",
              "type": "process",
              "label": "Initialize Book b = {1, 'C Programming', 'Kernighan', 299.0}"
            },
            {
              "id": "4",
              "type": "output",
              "label": "Display b.id, b.title, b.author, b.price"
            },
            {
              "id": "5",
              "type": "end",
              "label": "Stop"
            }
          ],
          "edges": [
            {
              "source": "1",
              "target": "2"
            },
            {
              "source": "2",
              "target": "3"
            },
            {
              "source": "3",
              "target": "4"
            },
            {
              "source": "4",
              "target": "5"
            }
          ]
        },
        "starterCode": {
          "supportedLanguages": [
            "c"
          ],
          "templates": {
            "c": "#include <stdio.h>\n\ntypedef struct {\n    // Write your fields here (id, title, author, price)\n} Book;\n\nint main() {\n    Book b = {1, \"C Programming\", \"Kernighan\", 299.0};\n    printf(\"ID: %d\\nTitle: %s\\nAuthor: %s\\nPrice: %.2f\\n\", b.id, b.title, b.author, b.price);\n    return 0;\n}"
          }
        },
        "samples": [
          {
            "input": "",
            "output": "ID: 1\nTitle: C Programming\nAuthor: Kernighan\nPrice: 299.00\n"
          }
        ]
      },
      {
        "part": "4",
        "title": "Pointers – Manage Book List Dynamically",
        "problemStatement": "Use pointers to manage the list of books dynamically.",
        "theory": "Dynamic memory allocation using malloc(), calloc(), and realloc() allows the program to allocate memory at runtime. Instead of a fixed-size array, a pointer to Book can grow as needed using realloc(). free() releases memory when no longer needed, preventing memory leaks.",
        "algorithm": "1. Start\n2. Declare Book pointer: Book* books = NULL\n3. To add: use realloc() to increase size by 1, store new book\n4. To display: iterate through pointer using index\n5. To free: call free(books) at end\n6. Stop",
        "flowchart": {
          "nodes": [
            {
              "id": "1",
              "type": "start",
              "label": "Start"
            },
            {
              "id": "2",
              "type": "process",
              "label": "books = NULL, count = 0"
            },
            {
              "id": "3",
              "type": "process",
              "label": "books = realloc(books, (count+1) * sizeof(Book))"
            },
            {
              "id": "4",
              "type": "input",
              "label": "Read new book into books[count]"
            },
            {
              "id": "5",
              "type": "process",
              "label": "count++"
            },
            {
              "id": "6",
              "type": "output",
              "label": "Display all books"
            },
            {
              "id": "7",
              "type": "process",
              "label": "free(books)"
            },
            {
              "id": "8",
              "type": "end",
              "label": "Stop"
            }
          ],
          "edges": [
            {
              "source": "1",
              "target": "2"
            },
            {
              "source": "2",
              "target": "3"
            },
            {
              "source": "3",
              "target": "4"
            },
            {
              "source": "4",
              "target": "5"
            },
            {
              "source": "5",
              "target": "6"
            },
            {
              "source": "6",
              "target": "7"
            },
            {
              "source": "7",
              "target": "8"
            }
          ]
        },
        "starterCode": {
          "supportedLanguages": [
            "c"
          ],
          "templates": {
            "c": "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\ntypedef struct { int id; char title[100]; char author[50]; float price; } Book;\n\nvoid manageBooks() {\n    // Write code using pointers/dynamic memory\n}\n\nint main() {\n    manageBooks();\n    return 0;\n}"
          }
        },
        "samples": [
          {
            "input": "",
            "output": "1 | C Programming | Kernighan | 299.00\n"
          }
        ]
      }
    ]
  },
  {
    "_id": new ObjectId("685b2a1f3c4e8d0012a7b401"),
    "subjectId": new ObjectId("685b2a1f3c4e8d0012a7b001"),
    "experimentNumber": 3,
    "subExperiments": [
      {
        "title": "Implement Basic Linux Commands",
        "problemStatement": "Implement any one basic command of Linux like ls, cp, mv and others using kernel APIs.",
        "theory": "Linux kernel APIs allow programs to interact directly with the OS. To implement ls, opendir() opens a directory and readdir() reads its entries. To implement cp, open() opens source and destination files, read() reads data, and write() writes it. To implement mv, rename() moves or renames a file.",
        "algorithm": "1. Start\n2. Open directory using opendir()\n3. Read each entry using readdir()\n4. Print each entry name\n5. Close directory using closedir()\n6. Stop",
        "flowchart": {
          "nodes": [
            {
              "id": "1",
              "type": "start",
              "label": "Start"
            },
            {
              "id": "2",
              "type": "process",
              "label": "dir = opendir('.')"
            },
            {
              "id": "3",
              "type": "decision",
              "label": "dir == NULL?"
            },
            {
              "id": "4",
              "type": "output",
              "label": "Print error, exit"
            },
            {
              "id": "5",
              "type": "process",
              "label": "entry = readdir(dir)"
            },
            {
              "id": "6",
              "type": "decision",
              "label": "entry != NULL?"
            },
            {
              "id": "7",
              "type": "output",
              "label": "Print entry->d_name"
            },
            {
              "id": "8",
              "type": "process",
              "label": "closedir(dir)"
            },
            {
              "id": "9",
              "type": "end",
              "label": "Stop"
            }
          ],
          "edges": [
            {
              "source": "1",
              "target": "2"
            },
            {
              "source": "2",
              "target": "3"
            },
            {
              "source": "3",
              "target": "4",
              "label": "Yes"
            },
            {
              "source": "3",
              "target": "5",
              "label": "No"
            },
            {
              "source": "5",
              "target": "6"
            },
            {
              "source": "6",
              "target": "7",
              "label": "Yes"
            },
            {
              "source": "7",
              "target": "5"
            },
            {
              "source": "6",
              "target": "8",
              "label": "No"
            },
            {
              "source": "8",
              "target": "9"
            }
          ]
        },
        "starterCode": {
          "supportedLanguages": [
            "c"
          ],
          "templates": {
            "c": "#include <stdio.h>\n#include <dirent.h>\n\nvoid implementCommand() {\n    // Write your code here (implement ls, cp, or mv)\n}\n\nint main() {\n    implementCommand();\n    return 0;\n}"
          }
        },
        "samples": [
          {
            "input": "",
            "output": ".\n..\n"
          }
        ]
      }
    ]
  },
  {
    "_id": new ObjectId("685b2a1f3c4e8d0012a7b402"),
    "subjectId": new ObjectId("685b2a1f3c4e8d0012a7b001"),
    "experimentNumber": 4,
    "subExperiments": [
      {
        "title": "Child Process using Fork",
        "problemStatement": "Create a child process in Linux using the fork system call. From the child process obtain the process ID of both child and parent by using getpid and getppid system call.",
        "theory": "fork() creates a new child process by duplicating the calling process. It returns 0 in the child process and the child's PID in the parent. getpid() returns the current process ID and getppid() returns the parent process ID. Both parent and child execute concurrently after the fork.",
        "algorithm": "1. Start\n2. Call fork() to create child process\n3. If fork() returns 0, we are in child process\n4. Child: print getpid() and getppid()\n5. If fork() > 0, we are in parent process\n6. Parent: print getpid()\n7. Stop",
        "flowchart": {
          "nodes": [
            {
              "id": "1",
              "type": "start",
              "label": "Start"
            },
            {
              "id": "2",
              "type": "process",
              "label": "pid = fork()"
            },
            {
              "id": "3",
              "type": "decision",
              "label": "pid == 0?"
            },
            {
              "id": "4",
              "type": "output",
              "label": "Child: print getpid(), getppid()"
            },
            {
              "id": "5",
              "type": "output",
              "label": "Parent: print getpid()"
            },
            {
              "id": "6",
              "type": "end",
              "label": "Stop"
            }
          ],
          "edges": [
            {
              "source": "1",
              "target": "2"
            },
            {
              "source": "2",
              "target": "3"
            },
            {
              "source": "3",
              "target": "4",
              "label": "Yes (Child)"
            },
            {
              "source": "3",
              "target": "5",
              "label": "No (Parent)"
            },
            {
              "source": "4",
              "target": "6"
            },
            {
              "source": "5",
              "target": "6"
            }
          ]
        },
        "starterCode": {
          "supportedLanguages": [
            "c"
          ],
          "templates": {
            "c": "#include <stdio.h>\n#include <unistd.h>\n\nvoid processDemo() {\n    // Write your code here (use fork, getpid, getppid)\n}\n\nint main() {\n    processDemo();\n    return 0;\n}"
          }
        },
        "samples": [
          {
            "input": "",
            "output": "Parent Process:\n  Parent PID: 1000\n  Child PID: 1001\nChild Process:\n  Child PID: 1001\n  Parent PID: 1000\n"
          }
        ]
      }
    ]
  },
  {
    "_id": new ObjectId("685b2a1f3c4e8d0012a7b403"),
    "subjectId": new ObjectId("685b2a1f3c4e8d0012a7b001"),
    "experimentNumber": 5,
    "subExperiments": [
      {
        "title": "Non-Preemptive Scheduling",
        "problemStatement": "Write a program to demonstrate the concept of non-preemptive scheduling algorithms (any one).",
        "theory": "In non-preemptive scheduling, once a process is given the CPU, it runs to completion. FCFS (First Come First Serve) schedules processes in the order they arrive. SJF (Shortest Job First) picks the process with the smallest burst time. Both are non-preemptive and simple to implement but can cause convoy effect (FCFS) or starvation (SJF).",
        "algorithm": "1. Start\n2. Read n processes with arrival time and burst time\n3. Sort by arrival time (FCFS) or burst time (SJF)\n4. Calculate start time, finish time, turnaround time, waiting time for each process\n5. Turnaround time = finish time - arrival time\n6. Waiting time = turnaround time - burst time\n7. Display Gantt chart and average times\n8. Stop",
        "flowchart": {
          "nodes": [
            {
              "id": "1",
              "type": "start",
              "label": "Start"
            },
            {
              "id": "2",
              "type": "input",
              "label": "Read n, arrival[], burst[]"
            },
            {
              "id": "3",
              "type": "process",
              "label": "Sort by arrival time"
            },
            {
              "id": "4",
              "type": "process",
              "label": "i = 0, time = 0"
            },
            {
              "id": "5",
              "type": "decision",
              "label": "i < n?"
            },
            {
              "id": "6",
              "type": "process",
              "label": "start = max(time, arrival[i])"
            },
            {
              "id": "7",
              "type": "process",
              "label": "finish = start + burst[i]"
            },
            {
              "id": "8",
              "type": "process",
              "label": "tat = finish - arrival[i], wt = tat - burst[i]"
            },
            {
              "id": "9",
              "type": "process",
              "label": "time = finish, i++"
            },
            {
              "id": "10",
              "type": "output",
              "label": "Display results"
            },
            {
              "id": "11",
              "type": "end",
              "label": "Stop"
            }
          ],
          "edges": [
            {
              "source": "1",
              "target": "2"
            },
            {
              "source": "2",
              "target": "3"
            },
            {
              "source": "3",
              "target": "4"
            },
            {
              "source": "4",
              "target": "5"
            },
            {
              "source": "5",
              "target": "6",
              "label": "Yes"
            },
            {
              "source": "6",
              "target": "7"
            },
            {
              "source": "7",
              "target": "8"
            },
            {
              "source": "8",
              "target": "9"
            },
            {
              "source": "9",
              "target": "5"
            },
            {
              "source": "5",
              "target": "10",
              "label": "No"
            },
            {
              "source": "10",
              "target": "11"
            }
          ]
        },
        "starterCode": {
          "supportedLanguages": [
            "c"
          ],
          "templates": {
            "c": "#include <stdio.h>\n\nvoid fcfs(int n, int arrival[], int burst[]) {\n    // Write your code here (Non-Preemptive Scheduling)\n}\n\nint main() {\n    int n;\n    scanf(\"%d\", &n);\n    int arrival[n], burst[n];\n    for (int i = 0; i < n; i++) scanf(\"%d %d\", &arrival[i], &burst[i]);\n    fcfs(n, arrival, burst);\n    return 0;\n}"
          }
        },
        "samples": [
          {
            "input": "3\n0 5\n1 3\n2 8",
            "output": "\nProcess | Arrival | Burst | Finish | TAT | WT\nP1      | 0       | 5     | 5      | 5   | 0\nP2      | 1       | 3     | 8      | 7   | 4\nP3      | 2       | 8     | 16     | 14  | 6\n"
          }
        ]
      }
    ]
  },
  {
    "_id": new ObjectId("685b2a1f3c4e8d0012a7b404"),
    "subjectId": new ObjectId("685b2a1f3c4e8d0012a7b001"),
    "experimentNumber": 6,
    "subExperiments": [
      {
        "title": "Preemptive Scheduling",
        "problemStatement": "Write a program to demonstrate the concept of preemptive scheduling algorithms (any one).",
        "theory": "In preemptive scheduling, a running process can be interrupted and replaced by another. Round Robin assigns a fixed time quantum to each process in order. SRTF (Shortest Remaining Time First) preempts the current process if a new process arrives with a shorter remaining burst time. These algorithms improve response time and fairness.",
        "algorithm": "1. Start\n2. Read n processes with arrival time and burst time\n3. Read time quantum q\n4. Use a queue and simulate Round Robin\n5. At each time unit, check if process quantum is exhausted\n6. If yes, move to next process in queue\n7. Calculate TAT and WT for each process\n8. Display results\n9. Stop",
        "flowchart": {
          "nodes": [
            {
              "id": "1",
              "type": "start",
              "label": "Start"
            },
            {
              "id": "2",
              "type": "input",
              "label": "Read n, arrival[], burst[], quantum"
            },
            {
              "id": "3",
              "type": "process",
              "label": "Initialize remaining[] = burst[]"
            },
            {
              "id": "4",
              "type": "process",
              "label": "time = 0, completed = 0"
            },
            {
              "id": "5",
              "type": "decision",
              "label": "completed < n?"
            },
            {
              "id": "6",
              "type": "process",
              "label": "Execute process for min(remaining, quantum)"
            },
            {
              "id": "7",
              "type": "process",
              "label": "Update remaining, time"
            },
            {
              "id": "8",
              "type": "decision",
              "label": "remaining == 0?"
            },
            {
              "id": "9",
              "type": "process",
              "label": "Record finish time, completed++"
            },
            {
              "id": "10",
              "type": "output",
              "label": "Display TAT, WT"
            },
            {
              "id": "11",
              "type": "end",
              "label": "Stop"
            }
          ],
          "edges": [
            {
              "source": "1",
              "target": "2"
            },
            {
              "source": "2",
              "target": "3"
            },
            {
              "source": "3",
              "target": "4"
            },
            {
              "source": "4",
              "target": "5"
            },
            {
              "source": "5",
              "target": "6",
              "label": "Yes"
            },
            {
              "source": "6",
              "target": "7"
            },
            {
              "source": "7",
              "target": "8"
            },
            {
              "source": "8",
              "target": "9",
              "label": "Yes"
            },
            {
              "source": "8",
              "target": "5",
              "label": "No"
            },
            {
              "source": "9",
              "target": "5"
            },
            {
              "source": "5",
              "target": "10",
              "label": "No"
            },
            {
              "source": "10",
              "target": "11"
            }
          ]
        },
        "starterCode": {
          "supportedLanguages": [
            "c"
          ],
          "templates": {
            "c": "#include <stdio.h>\n\nvoid roundRobin(int n, int q, int arrival[], int burst[]) {\n    // Write your code here (Preemptive Scheduling)\n}\n\nint main() {\n    int n, q;\n    scanf(\"%d %d\", &n, &q);\n    int arrival[n], burst[n];\n    for (int i = 0; i < n; i++) scanf(\"%d %d\", &arrival[i], &burst[i]);\n    roundRobin(n, q, arrival, burst);\n    return 0;\n}"
          }
        },
        "samples": [
          {
            "input": "3 2\n0 5\n1 3\n2 8",
            "output": "TAT and WT for processes displayed.\n"
          }
        ]
      }
    ]
  },
  {
    "_id": new ObjectId("685b2a1f3c4e8d0012a7b405"),
    "subjectId": new ObjectId("685b2a1f3c4e8d0012a7b001"),
    "experimentNumber": 7,
    "subExperiments": [
      {
        "title": "Producer Consumer Problem",
        "problemStatement": "Write a C program to implement solution of Producer Consumer problem through Semaphore.",
        "theory": "The Producer-Consumer problem is a classic synchronization problem. A producer generates data and puts it in a buffer; a consumer takes data from the buffer. Semaphores control access: 'empty' counts empty slots, 'full' counts filled slots, and 'mutex' ensures mutual exclusion. sem_wait() decrements and sem_post() increments a semaphore.",
        "algorithm": "1. Start\n2. Initialize semaphores: empty = BUFFER_SIZE, full = 0, mutex = 1\n3. Producer: sem_wait(empty), sem_wait(mutex), produce item, sem_post(mutex), sem_post(full)\n4. Consumer: sem_wait(full), sem_wait(mutex), consume item, sem_post(mutex), sem_post(empty)\n5. Run producer and consumer as threads\n6. Stop",
        "flowchart": {
          "nodes": [
            {
              "id": "1",
              "type": "start",
              "label": "Start"
            },
            {
              "id": "2",
              "type": "process",
              "label": "Init: empty=N, full=0, mutex=1"
            },
            {
              "id": "3",
              "type": "process",
              "label": "Producer: sem_wait(empty)"
            },
            {
              "id": "4",
              "type": "process",
              "label": "sem_wait(mutex)"
            },
            {
              "id": "5",
              "type": "process",
              "label": "Add item to buffer"
            },
            {
              "id": "6",
              "type": "process",
              "label": "sem_post(mutex), sem_post(full)"
            },
            {
              "id": "7",
              "type": "process",
              "label": "Consumer: sem_wait(full)"
            },
            {
              "id": "8",
              "type": "process",
              "label": "sem_wait(mutex)"
            },
            {
              "id": "9",
              "type": "process",
              "label": "Remove item from buffer"
            },
            {
              "id": "10",
              "type": "process",
              "label": "sem_post(mutex), sem_post(empty)"
            },
            {
              "id": "11",
              "type": "end",
              "label": "Stop"
            }
          ],
          "edges": [
            {
              "source": "1",
              "target": "2"
            },
            {
              "source": "2",
              "target": "3"
            },
            {
              "source": "3",
              "target": "4"
            },
            {
              "source": "4",
              "target": "5"
            },
            {
              "source": "5",
              "target": "6"
            },
            {
              "source": "6",
              "target": "7"
            },
            {
              "source": "7",
              "target": "8"
            },
            {
              "source": "8",
              "target": "9"
            },
            {
              "source": "9",
              "target": "10"
            },
            {
              "source": "10",
              "target": "11"
            }
          ]
        },
        "starterCode": {
          "supportedLanguages": [
            "c"
          ],
          "templates": {
            "c": "#include <stdio.h>\n#include <pthread.h>\n#include <semaphore.h>\n\nvoid* producer(void* arg) {\n    // Write your code here\n    return NULL;\n}\n\nvoid* consumer(void* arg) {\n    // Write your code here\n    return NULL;\n}\n\nint main() {\n    // Initialize semaphores and run threads\n    return 0;\n}"
          }
        },
        "samples": [
          {
            "input": "",
            "output": "Produced: 0\nConsumed: 0\n"
          }
        ]
      }
    ]
  },
  {
    "_id": new ObjectId("685b2a1f3c4e8d0012a7b406"),
    "subjectId": new ObjectId("685b2a1f3c4e8d0012a7b001"),
    "experimentNumber": 8,
    "subExperiments": [
      {
        "title": "Banker's Algorithm",
        "problemStatement": "Write a program to demonstrate the concept of deadlock avoidance through Banker's Algorithm.",
        "theory": "Banker's Algorithm is a deadlock avoidance algorithm. It checks whether granting a resource request will leave the system in a safe state. A safe state means there exists a sequence of processes that can all complete. It uses the Need matrix (Max - Allocation), Available resources, and simulates process execution to find a safe sequence.",
        "algorithm": "1. Start\n2. Read n processes, m resources, Allocation matrix, Max matrix, Available vector\n3. Calculate Need = Max - Allocation\n4. Initialize Finish[] = false, Work[] = Available\n5. Find a process i where Finish[i] == false and Need[i] <= Work\n6. If found: Work += Allocation[i], Finish[i] = true, add to safe sequence\n7. Repeat until all processes finish or no process found\n8. If all finish: Safe state, print sequence. Else: Unsafe state\n9. Stop",
        "flowchart": {
          "nodes": [
            {
              "id": "1",
              "type": "start",
              "label": "Start"
            },
            {
              "id": "2",
              "type": "input",
              "label": "Read Allocation, Max, Available"
            },
            {
              "id": "3",
              "type": "process",
              "label": "Need = Max - Allocation"
            },
            {
              "id": "4",
              "type": "process",
              "label": "Work = Available, Finish[] = false"
            },
            {
              "id": "5",
              "type": "decision",
              "label": "Find P[i]: !Finish[i] && Need[i]<=Work"
            },
            {
              "id": "6",
              "type": "process",
              "label": "Work += Alloc[i], Finish[i]=true"
            },
            {
              "id": "7",
              "type": "decision",
              "label": "All Finish == true?"
            },
            {
              "id": "8",
              "type": "output",
              "label": "Safe State: print sequence"
            },
            {
              "id": "9",
              "type": "output",
              "label": "Unsafe State"
            },
            {
              "id": "10",
              "type": "end",
              "label": "Stop"
            }
          ],
          "edges": [
            {
              "source": "1",
              "target": "2"
            },
            {
              "source": "2",
              "target": "3"
            },
            {
              "source": "3",
              "target": "4"
            },
            {
              "source": "4",
              "target": "5"
            },
            {
              "source": "5",
              "target": "6",
              "label": "Found"
            },
            {
              "source": "6",
              "target": "5"
            },
            {
              "source": "5",
              "target": "7",
              "label": "Not Found"
            },
            {
              "source": "7",
              "target": "8",
              "label": "Yes"
            },
            {
              "source": "7",
              "target": "9",
              "label": "No"
            },
            {
              "source": "8",
              "target": "10"
            },
            {
              "source": "9",
              "target": "10"
            }
          ]
        },
        "starterCode": {
          "supportedLanguages": [
            "c"
          ],
          "templates": {
            "c": "#include <stdio.h>\n\nvoid bankersAlgorithm(int n, int m, int alloc[][10], int max[][10], int avail[]) {\n    // Write your code here (Deadlock avoidance)\n}\n\nint main() {\n    int n, m;\n    scanf(\"%d %d\", &n, &m);\n    int alloc[10][10], max[10][10], avail[10];\n    for(int i=0; i<n; i++) for(int j=0; j<m; j++) scanf(\"%d\", &alloc[i][j]);\n    for(int i=0; i<n; i++) for(int j=0; j<m; j++) scanf(\"%d\", &max[i][j]);\n    for(int j=0; j<m; j++) scanf(\"%d\", &avail[j]);\n    bankersAlgorithm(n, m, alloc, max, avail);\n    return 0;\n}"
          }
        },
        "samples": [
          {
            "input": "5 3\n0 1 0\n2 0 0\n3 0 2\n2 1 1\n0 0 2\n7 5 3\n3 2 2\n9 0 2\n2 2 2\n4 3 3\n3 3 2",
            "output": "Safe State: print sequence\n"
          }
        ]
      }
    ]
  },
  {
    "_id": new ObjectId("685b2a1f3c4e8d0012a7b407"),
    "subjectId": new ObjectId("685b2a1f3c4e8d0012a7b001"),
    "experimentNumber": 9,
    "subExperiments": [
      {
        "title": "MVT and MFT Memory Management",
        "problemStatement": "Write a program to demonstrate the concept of MVT and MFT memory management techniques.",
        "theory": "MFT (Multiprogramming with Fixed number of Tasks) divides memory into fixed-size partitions. Each process is loaded into a partition. Internal fragmentation occurs when a process is smaller than the partition. MVT (Multiprogramming with Variable number of Tasks) allocates exactly the memory needed by each process. External fragmentation can occur as free holes form between allocated blocks.",
        "algorithm": "1. Start\n2. For MFT: define fixed partitions, assign processes to partitions, show internal fragmentation\n3. For MVT: maintain a free memory list, allocate exact memory for each process, show external fragmentation\n4. Display memory layout after each allocation\n5. Stop",
        "flowchart": {
          "nodes": [
            {
              "id": "1",
              "type": "start",
              "label": "Start"
            },
            {
              "id": "2",
              "type": "input",
              "label": "Read total memory, partition size (MFT)"
            },
            {
              "id": "3",
              "type": "process",
              "label": "Create fixed partitions"
            },
            {
              "id": "4",
              "type": "input",
              "label": "Read process sizes"
            },
            {
              "id": "5",
              "type": "process",
              "label": "Assign each process to a partition"
            },
            {
              "id": "6",
              "type": "output",
              "label": "Show partition map and fragmentation"
            },
            {
              "id": "7",
              "type": "input",
              "label": "Read process sizes (MVT)"
            },
            {
              "id": "8",
              "type": "process",
              "label": "Allocate exact memory for each"
            },
            {
              "id": "9",
              "type": "output",
              "label": "Show memory map"
            },
            {
              "id": "10",
              "type": "end",
              "label": "Stop"
            }
          ],
          "edges": [
            {
              "source": "1",
              "target": "2"
            },
            {
              "source": "2",
              "target": "3"
            },
            {
              "source": "3",
              "target": "4"
            },
            {
              "source": "4",
              "target": "5"
            },
            {
              "source": "5",
              "target": "6"
            },
            {
              "source": "6",
              "target": "7"
            },
            {
              "source": "7",
              "target": "8"
            },
            {
              "source": "8",
              "target": "9"
            },
            {
              "source": "9",
              "target": "10"
            }
          ]
        },
        "starterCode": {
          "supportedLanguages": [
            "c"
          ],
          "templates": {
            "c": "#include <stdio.h>\n\nvoid mft(int pSize, int processes[], int n) {\n    // Write your code here\n}\n\nvoid mvt(int processes[], int n, int totalMemory) {\n    // Write your code here\n}\n\nint main() {\n    int n, totalMemory, pSize;\n    scanf(\"%d %d %d\", &n, &totalMemory, &pSize);\n    int processes[n];\n    for (int i = 0; i < n; i++) scanf(\"%d\", &processes[i]);\n    mft(pSize, processes, n);\n    mvt(processes, n, totalMemory);\n    return 0;\n}"
          }
        },
        "samples": [
          {
            "input": "4 1024 256\n200 150 300 100",
            "output": "\n--- MFT ---\nPartition Size: 256 KB\nP1 (200 KB) -> Partition 1 | Internal Frag: 56 KB\n"
          }
        ]
      }
    ]
  },
  {
    "_id": new ObjectId("685b2a1f3c4e8d0012a7b408"),
    "subjectId": new ObjectId("685b2a1f3c4e8d0012a7b001"),
    "experimentNumber": 10,
    "subExperiments": [
      {
        "title": "Dynamic Partitioning",
        "problemStatement": "Write a program to demonstrate the concept of dynamic partitioning placement algorithms i.e. Best Fit, First Fit, Worst-Fit etc.",
        "theory": "Dynamic partitioning allocates memory based on process size. First Fit allocates the first hole that is large enough. Best Fit allocates the smallest hole that fits the process, minimizing wasted space. Worst Fit allocates the largest hole, leaving large remaining fragments. All three scan the free memory list differently.",
        "algorithm": "1. Start\n2. Read memory blocks and process sizes\n3. First Fit: scan from start, allocate first block >= process size\n4. Best Fit: scan all, allocate smallest block >= process size\n5. Worst Fit: scan all, allocate largest block >= process size\n6. Display allocation results for each algorithm\n7. Stop",
        "flowchart": {
          "nodes": [
            {
              "id": "1",
              "type": "start",
              "label": "Start"
            },
            {
              "id": "2",
              "type": "input",
              "label": "Read blocks[], processes[]"
            },
            {
              "id": "3",
              "type": "process",
              "label": "First Fit: find first block >= process"
            },
            {
              "id": "4",
              "type": "process",
              "label": "Best Fit: find smallest block >= process"
            },
            {
              "id": "5",
              "type": "process",
              "label": "Worst Fit: find largest block >= process"
            },
            {
              "id": "6",
              "type": "output",
              "label": "Display allocation table"
            },
            {
              "id": "7",
              "type": "end",
              "label": "Stop"
            }
          ],
          "edges": [
            {
              "source": "1",
              "target": "2"
            },
            {
              "source": "2",
              "target": "3"
            },
            {
              "source": "3",
              "target": "4"
            },
            {
              "source": "4",
              "target": "5"
            },
            {
              "source": "5",
              "target": "6"
            },
            {
              "source": "6",
              "target": "7"
            }
          ]
        },
        "starterCode": {
          "supportedLanguages": [
            "c"
          ],
          "templates": {
            "c": "#include <stdio.h>\n\nvoid firstFit(int blocks[], int m, int processes[], int n) { \n    // Write your code here\n}\n\nvoid bestFit(int blocks[], int m, int processes[], int n) { \n    // Write your code here\n}\n\nvoid worstFit(int blocks[], int m, int processes[], int n) { \n    // Write your code here\n}\n\nint main() {\n    int blocks[] = {100, 500, 200, 300, 600};\n    int processes[] = {212, 417, 112, 426};\n    int m = 5, n = 4;\n    firstFit(blocks, m, processes, n);\n    bestFit(blocks, m, processes, n);\n    worstFit(blocks, m, processes, n);\n    return 0;\n}"
          }
        },
        "samples": [
          {
            "input": "",
            "output": "\nFirst Fit:\nProcess\tSize\tBlock\nP1\t212\t2\nP2\t417\t5\nP3\t112\t2\nP4\t426\t-1\n"
          }
        ]
      }
    ]
  },
  {
    "_id": new ObjectId("685b2a1f3c4e8d0012a7b409"),
    "subjectId": new ObjectId("685b2a1f3c4e8d0012a7b001"),
    "experimentNumber": 11,
    "subExperiments": [
      {
        "title": "Virtual Memory / Demand Paging",
        "problemStatement": "Write a program to demonstrate the concept of demand paging for simulation of Virtual Memory implementation.",
        "theory": "Demand paging loads pages into memory only when they are needed. When a page is not in memory, a page fault occurs and the OS loads the page from disk. A page table tracks which pages are in memory. This allows programs larger than physical memory to run by using disk as an extension of RAM.",
        "algorithm": "1. Start\n2. Read page reference string and number of frames\n3. Initialize all frames as empty (-1)\n4. For each page in reference string:\n5. Check if page is already in a frame (no page fault)\n6. If not, page fault occurs: load page into a free frame or replace using a policy\n7. Count total page faults\n8. Display frame state after each reference\n9. Stop",
        "flowchart": {
          "nodes": [
            {
              "id": "1",
              "type": "start",
              "label": "Start"
            },
            {
              "id": "2",
              "type": "input",
              "label": "Read pages[], frames count"
            },
            {
              "id": "3",
              "type": "process",
              "label": "Initialize frames[] = -1, faults = 0"
            },
            {
              "id": "4",
              "type": "process",
              "label": "i = 0"
            },
            {
              "id": "5",
              "type": "decision",
              "label": "i < page count?"
            },
            {
              "id": "6",
              "type": "decision",
              "label": "Page in frames?"
            },
            {
              "id": "7",
              "type": "process",
              "label": "Page fault: load page, faults++"
            },
            {
              "id": "8",
              "type": "output",
              "label": "Display frame state"
            },
            {
              "id": "9",
              "type": "process",
              "label": "i++"
            },
            {
              "id": "10",
              "type": "output",
              "label": "Print total faults"
            },
            {
              "id": "11",
              "type": "end",
              "label": "Stop"
            }
          ],
          "edges": [
            {
              "source": "1",
              "target": "2"
            },
            {
              "source": "2",
              "target": "3"
            },
            {
              "source": "3",
              "target": "4"
            },
            {
              "source": "4",
              "target": "5"
            },
            {
              "source": "5",
              "target": "6",
              "label": "Yes"
            },
            {
              "source": "6",
              "target": "7",
              "label": "No (Page Fault)"
            },
            {
              "source": "6",
              "target": "8",
              "label": "Yes (Hit)"
            },
            {
              "source": "7",
              "target": "8"
            },
            {
              "source": "8",
              "target": "9"
            },
            {
              "source": "9",
              "target": "5"
            },
            {
              "source": "5",
              "target": "10",
              "label": "No"
            },
            {
              "source": "10",
              "target": "11"
            }
          ]
        },
        "starterCode": {
          "supportedLanguages": [
            "c"
          ],
          "templates": {
            "c": "#include <stdio.h>\n\nvoid demandPaging(int frames, int n, int pages[]) {\n    // Write your code here\n}\n\nint main() {\n    int frames, n;\n    scanf(\"%d %d\", &frames, &n);\n    int pages[n];\n    for (int i = 0; i < n; i++) scanf(\"%d\", &pages[i]);\n    demandPaging(frames, n, pages);\n    return 0;\n}"
          }
        },
        "samples": [
          {
            "input": "3 13\n7 0 1 2 0 3 0 4 2 3 0 3 2",
            "output": "\nPage\tFrames\t\t\tFault\n7\t7 -1 -1 \t*\n0\t7 0 -1 \t*\n1\t7 0 1 \t*\n2\t2 0 1 \t*\nTotal Page Faults: 9\n"
          }
        ]
      }
    ]
  },
  {
    "_id": new ObjectId("685b2a1f3c4e8d0012a7b410"),
    "subjectId": new ObjectId("685b2a1f3c4e8d0012a7b001"),
    "experimentNumber": 12,
    "subExperiments": [
      {
        "title": "Page Replacement Policies",
        "problemStatement": "Write a program in C to demonstrate the concept of page replacement policies for handling page faults eg: FIFO, LRU etc.",
        "theory": "Page replacement algorithms decide which page to evict when a page fault occurs and frames are full. FIFO removes the oldest loaded page. LRU (Least Recently Used) removes the page not used for the longest time. Optimal replaces the page that will not be used for the longest time in future. LRU generally performs better than FIFO but requires tracking usage history.",
        "algorithm": "1. Start\n2. Read page reference string and number of frames\n3. FIFO: maintain a queue, replace front when full\n4. LRU: track last used time for each frame, replace least recently used\n5. Count page faults for each algorithm\n6. Display results\n7. Stop",
        "flowchart": {
          "nodes": [
            {
              "id": "1",
              "type": "start",
              "label": "Start"
            },
            {
              "id": "2",
              "type": "input",
              "label": "Read pages[], frames"
            },
            {
              "id": "3",
              "type": "process",
              "label": "Run FIFO, count faults"
            },
            {
              "id": "4",
              "type": "process",
              "label": "Run LRU, count faults"
            },
            {
              "id": "5",
              "type": "output",
              "label": "Display FIFO faults, LRU faults"
            },
            {
              "id": "6",
              "type": "end",
              "label": "Stop"
            }
          ],
          "edges": [
            {
              "source": "1",
              "target": "2"
            },
            {
              "source": "2",
              "target": "3"
            },
            {
              "source": "3",
              "target": "4"
            },
            {
              "source": "4",
              "target": "5"
            },
            {
              "source": "5",
              "target": "6"
            }
          ]
        },
        "starterCode": {
          "supportedLanguages": [
            "c"
          ],
          "templates": {
            "c": "#include <stdio.h>\n\nint fifo(int pages[], int n, int frames) { \n    // Write your code here\n    return 0; \n}\n\nint lru(int pages[], int n, int frames) { \n    // Write your code here\n    return 0; \n}\n\nint main() {\n    int frames, n;\n    scanf(\"%d %d\", &frames, &n);\n    int pages[n];\n    for (int i = 0; i < n; i++) scanf(\"%d\", &pages[i]);\n    printf(\"FIFO Page Faults: %d\\n\", fifo(pages, n, frames));\n    printf(\"LRU Page Faults: %d\\n\", lru(pages, n, frames));\n    return 0;\n}"
          }
        },
        "samples": [
          {
            "input": "3 13\n7 0 1 2 0 3 0 4 2 3 0 3 2",
            "output": "FIFO Page Faults: 15\nLRU Page Faults: 10\n"
          }
        ]
      }
    ]
  },
  {
    "_id": new ObjectId("685b2a1f3c4e8d0012a7b411"),
    "subjectId": new ObjectId("685b2a1f3c4e8d0012a7b001"),
    "experimentNumber": 13,
    "subExperiments": [
      {
        "title": "File Allocation Strategies",
        "problemStatement": "Write a C program to simulate File allocation strategies typically sequential, indexed and linked files.",
        "theory": "Sequential allocation stores file blocks contiguously on disk — fast access but suffers from external fragmentation. Linked allocation uses pointers in each block to point to the next — no fragmentation but slow random access. Indexed allocation uses an index block that holds pointers to all file blocks — supports direct access and no external fragmentation.",
        "algorithm": "1. Start\n2. Sequential: allocate contiguous blocks starting from a given start block\n3. Linked: each block contains data and pointer to next block\n4. Indexed: an index block holds addresses of all data blocks\n5. Display block allocation for each strategy\n6. Stop",
        "flowchart": {
          "nodes": [
            {
              "id": "1",
              "type": "start",
              "label": "Start"
            },
            {
              "id": "2",
              "type": "input",
              "label": "Read file size, start block"
            },
            {
              "id": "3",
              "type": "process",
              "label": "Sequential: allocate start to start+size-1"
            },
            {
              "id": "4",
              "type": "process",
              "label": "Linked: chain blocks with pointers"
            },
            {
              "id": "5",
              "type": "process",
              "label": "Indexed: create index block with all block addresses"
            },
            {
              "id": "6",
              "type": "output",
              "label": "Display all three allocations"
            },
            {
              "id": "7",
              "type": "end",
              "label": "Stop"
            }
          ],
          "edges": [
            {
              "source": "1",
              "target": "2"
            },
            {
              "source": "2",
              "target": "3"
            },
            {
              "source": "3",
              "target": "4"
            },
            {
              "source": "4",
              "target": "5"
            },
            {
              "source": "5",
              "target": "6"
            },
            {
              "source": "6",
              "target": "7"
            }
          ]
        },
        "starterCode": {
          "supportedLanguages": [
            "c"
          ],
          "templates": {
            "c": "#include <stdio.h>\n\nvoid sequential(int start, int length) { \n    // Write your code here\n}\n\nvoid linked(int blocks[], int length) { \n    // Write your code here\n}\n\nvoid indexed(int indexBlock, int blocks[], int length) { \n    // Write your code here\n}\n\nint main() {\n    int start = 5, length = 4;\n    int blocks[] = {10, 15, 22, 30};\n    sequential(start, length);\n    linked(blocks, length);\n    indexed(3, blocks, length);\n    return 0;\n}"
          }
        },
        "samples": [
          {
            "input": "",
            "output": "\nSequential Allocation:\nFile occupies blocks: 5 6 7 8 \n\nLinked Allocation:\nBlock 10 -> Block 15\nBlock 15 -> Block 22\nBlock 22 -> Block 30\nBlock 30 -> NULL\n\nIndexed Allocation:\nIndex Block: 3\nData Blocks: 10 15 22 30 \n"
          }
        ]
      }
    ]
  },
  {
    "_id": new ObjectId("685b2a1f3c4e8d0012a7b412"),
    "subjectId": new ObjectId("685b2a1f3c4e8d0012a7b001"),
    "experimentNumber": 14,
    "subExperiments": [
      {
        "title": "Multi-Level Directory Structure",
        "problemStatement": "Write a C program to simulate file organization of multi-level directory structure.",
        "theory": "A multi-level directory structure organizes files in a hierarchy of directories and subdirectories, like a tree. Each directory can contain files and other directories. This allows users to organize files logically and avoids name conflicts. In C, this can be simulated using structures with arrays of children and file names.",
        "algorithm": "1. Start\n2. Define a Directory structure with name, list of files, list of subdirectories\n3. Create root directory\n4. Add subdirectories and files to directories\n5. Display the full directory tree using recursive traversal\n6. Stop",
        "flowchart": {
          "nodes": [
            {
              "id": "1",
              "type": "start",
              "label": "Start"
            },
            {
              "id": "2",
              "type": "process",
              "label": "Create root directory"
            },
            {
              "id": "3",
              "type": "process",
              "label": "Add subdirectories to root"
            },
            {
              "id": "4",
              "type": "process",
              "label": "Add files to directories"
            },
            {
              "id": "5",
              "type": "output",
              "label": "Display directory tree (recursive)"
            },
            {
              "id": "6",
              "type": "end",
              "label": "Stop"
            }
          ],
          "edges": [
            {
              "source": "1",
              "target": "2"
            },
            {
              "source": "2",
              "target": "3"
            },
            {
              "source": "3",
              "target": "4"
            },
            {
              "source": "4",
              "target": "5"
            },
            {
              "source": "5",
              "target": "6"
            }
          ]
        },
        "starterCode": {
          "supportedLanguages": [
            "c"
          ],
          "templates": {
            "c": "#include <stdio.h>\n\nvoid simulateDirectory() {\n    // Write your code here\n}\n\nint main() {\n    simulateDirectory();\n    return 0;\n}"
          }
        },
        "samples": [
          {
            "input": "",
            "output": "|-- root/\n  |-- config.sys\n  |-- home/\n    |-- user/\n      |-- resume.pdf\n      |-- notes.txt\n"
          }
        ]
      }
    ]
  },
  {
    "_id": new ObjectId("685b2a1f3c4e8d0012a7b413"),
    "subjectId": new ObjectId("685b2a1f3c4e8d0012a7b001"),
    "experimentNumber": 15,
    "subExperiments": [
      {
        "title": "Disk Scheduling",
        "problemStatement": "Write a program in C to do disk scheduling - FCFS, SCAN, C-SCAN.",
        "theory": "Disk scheduling algorithms determine the order in which disk I/O requests are serviced. FCFS services requests in arrival order — simple but inefficient. SCAN moves the disk head in one direction servicing requests, then reverses — like an elevator. C-SCAN (Circular SCAN) moves in one direction only and jumps back to the start, providing more uniform wait times.",
        "algorithm": "1. Start\n2. Read disk requests queue and initial head position\n3. FCFS: service requests in order, sum absolute differences\n4. SCAN: sort requests, move head in one direction then reverse\n5. C-SCAN: sort requests, move in one direction, jump to start and continue\n6. Display total head movement for each algorithm\n7. Stop",
        "flowchart": {
          "nodes": [
            {
              "id": "1",
              "type": "start",
              "label": "Start"
            },
            {
              "id": "2",
              "type": "input",
              "label": "Read requests[], head"
            },
            {
              "id": "3",
              "type": "process",
              "label": "FCFS: sum |requests[i] - prev|"
            },
            {
              "id": "4",
              "type": "process",
              "label": "SCAN: sort, move up then down"
            },
            {
              "id": "5",
              "type": "process",
              "label": "C-SCAN: sort, move up, jump to 0, continue"
            },
            {
              "id": "6",
              "type": "output",
              "label": "Display total movements"
            },
            {
              "id": "7",
              "type": "end",
              "label": "Stop"
            }
          ],
          "edges": [
            {
              "source": "1",
              "target": "2"
            },
            {
              "source": "2",
              "target": "3"
            },
            {
              "source": "3",
              "target": "4"
            },
            {
              "source": "4",
              "target": "5"
            },
            {
              "source": "5",
              "target": "6"
            },
            {
              "source": "6",
              "target": "7"
            }
          ]
        },
        "starterCode": {
          "supportedLanguages": [
            "c"
          ],
          "templates": {
            "c": "#include <stdio.h>\n\nvoid fcfs(int req[], int n, int head) { \n    // Write your code here\n}\n\nvoid scan(int req[], int n, int head, int diskSize) { \n    // Write your code here\n}\n\nvoid cscan(int req[], int n, int head, int diskSize) { \n    // Write your code here\n}\n\nint main() {\n    int n, head, diskSize;\n    scanf(\"%d %d %d\", &n, &head, &diskSize);\n    int req[n];\n    for (int i = 0; i < n; i++) scanf(\"%d\", &req[i]);\n    fcfs(req, n, head);\n    // Assume scan and cscan are called appropriately\n    return 0;\n}"
          }
        },
        "samples": [
          {
            "input": "8 53 200\n98 183 37 122 14 124 65 67",
            "output": "\nFCFS Order: 53 -> 98 -> 183 -> 37 -> 122 -> 14 -> 124 -> 65 -> 67\nTotal Head Movement: 640\n"
          }
        ]
      }
    ]
  }
];

const seedDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/bh_labs';
  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB for seeding...');

    await Subject.deleteMany({});
    console.log('Deleted all subjects.');
    await Experiment.deleteMany({});
    console.log('Deleted all experiments.');

    await Subject.insertMany(subjects);
    console.log('Seeded', subjects.length, 'subjects.');
    await Experiment.insertMany(experiments);
    console.log('Seeded', experiments.length, 'experiments.');

    console.log('Database seeded successfully!');
  } catch (err) {
    console.error('Seeding error:', err);
  } finally {
    await mongoose.connection.close();
    console.log('Connection closed.');
  }
};

seedDB();