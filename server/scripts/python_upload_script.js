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
    _id: new ObjectId("685b2a1f3c4e8d0012a7b003"),
    name: "Python Programming",
    code: "VSEC202",
    semester: 2,
    description:
      "This subject covers Python programming including data types, control structures, functions, file handling, exception handling, OOP concepts, GUI development, regular expressions, NumPy, and Pandas.",
  },
];

// ─── Experiments ──────────────────────────────────────────────────────────────
const experiments = [
  // ── Exp 1: Basic Programs ──────────────────────────────────────────────────────
  {
    _id: new ObjectId("685b2a1f3c4e8d0012a7b601"),
    subjectId: new ObjectId("685b2a1f3c4e8d0012a7b003"),
    experimentNumber: 1,
    subExperiments: [
      {
        part: "a",
        title: "Personalized Greeting Generator",
        concepts: ["Basic Input/Output", "String Formatting", "f-strings"],
        hints: [
          "Use the input() function to read strings from the standard input.",
          "Use f-strings (e.g. f'Hello, {name}!') for clean and modern string interpolation.",
          "Remember that input() always returns a string; no type conversion is needed for names.",
        ],
        problemStatement:
          "Write a python code to generate Personalized Greeting.",
        theory:
          "Python's input() reads user input as a string. f-strings (formatted string literals, Python 3.6+) allow embedding variables directly in strings using the f'...' syntax. This is the most modern and readable string formatting method in Python.",
        algorithm:
          "1. Start\n2. Read user's name\n3. Read time of day\n4. Construct greeting using f-string: f'Good {time_of_day}, {name}!'\n5. Print greeting\n6. Stop",
        flowchart: {
          nodes: [
            { id: "1", type: "start", label: "Start" },
            { id: "2", type: "input", label: "Read name, time_of_day" },
            {
              id: "3",
              type: "process",
              label: "greeting = f'Good {time_of_day}, {name}!'",
            },
            { id: "4", type: "output", label: "Print greeting" },
            { id: "5", type: "end", label: "Stop" },
          ],
          edges: [
            { source: "1", target: "2" },
            { source: "2", target: "3" },
            { source: "3", target: "4" },
            { source: "4", target: "5" },
          ],
        },
        starterCode: {
          supportedLanguages: ["python"],
          templates: {
            python:
              "def generate_greeting(name, time_of_day):\n    # Write your code here\n    # Return a personalized greeting string using f-string\n    pass\n\nif __name__ == '__main__':\n    name = input('Enter your name: ')\n    time_of_day = input('Enter time of day (Morning/Afternoon/Evening): ')\n    print(generate_greeting(name, time_of_day))",
          },
        },
        samples: [
          {
            input: "Alice\nMorning",
            output: "Good Morning, Alice! Hope you have a wonderful day.\n",
          },
        ],
      },
      {
        part: "b",
        title: "Calculating Areas of Geometric Figures",
        concepts: ["Functions", "Basic Mathematics", "Standard Library math"],
        hints: [
          "Import the math module to use math.pi for precise circle area calculations.",
          "Create separate helper functions for each shape to keep the code modular and clean.",
          "Use conditional statements (if-elif-else) to route the user's choice to the correct formula.",
        ],
        problemStatement:
          "Write a Python program to calculate areas of any geometric figures like circle, rectangle and triangle.",
        theory:
          "Python's math module provides math.pi for the constant π. Area formulas: circle = π*r², rectangle = length*width, triangle = 0.5*base*height. Python supports float arithmetic natively. The round() or f-string formatting controls decimal output precision.",
        algorithm:
          "1. Start\n2. Display menu: 1-Circle, 2-Rectangle, 3-Triangle\n3. Read choice\n4. If choice==1: read r, compute π*r²\n5. If choice==2: read l,w, compute l*w\n6. If choice==3: read b,h, compute 0.5*b*h\n7. Print area\n8. Stop",
        flowchart: {
          nodes: [
            { id: "1", type: "start", label: "Start" },
            { id: "2", type: "input", label: "Read choice" },
            { id: "3", type: "decision", label: "choice == 1?" },
            { id: "4", type: "process", label: "area = pi * r * r" },
            { id: "5", type: "decision", label: "choice == 2?" },
            { id: "6", type: "process", label: "area = l * w" },
            { id: "7", type: "process", label: "area = 0.5 * b * h" },
            { id: "8", type: "output", label: "Print area" },
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
          supportedLanguages: ["python"],
          templates: {
            python:
              "import math\n\ndef area_circle(r):      return math.pi * r * r\ndef area_rectangle(l,w): return l * w\ndef area_triangle(b,h):  return 0.5 * b * h\n\nif __name__ == '__main__':\n    choice = int(input('Enter choice (1-Circle, 2-Rectangle, 3-Triangle): '))\n    if choice == 1:\n        r = float(input('Enter radius: '))\n        print(f'Area of Circle = {area_circle(r):.2f}')\n    elif choice == 2:\n        l, w = float(input('Length: ')), float(input('Width: '))\n        print(f'Area of Rectangle = {area_rectangle(l,w):.2f}')\n    elif choice == 3:\n        b, h = float(input('Base: ')), float(input('Height: '))\n        print(f'Area of Triangle = {area_triangle(b,h):.2f}')",
          },
        },
        samples: [
          { input: "1\n7", output: "Area of Circle = 153.94\n" },
          { input: "2\n5\n3", output: "Area of Rectangle = 15.00\n" },
        ],
      },
      {
        part: "c",
        title: "Developing Conversion Utilities",
        concepts: ["Functions", "Arithmetic Operators", "Conditional Logic"],
        hints: [
          "Write conversion functions that accept a value and return the converted equivalent.",
          "Use parameters with default arguments if you want to support fixed conversion rates (e.g. 83.5 for USD).",
          "Format floating-point results to a specific number of decimal places using formatting (e.g., :.2f).",
        ],
        problemStatement:
          "Develop any converter such as Rupees to dollar, temperature convertor, inch to feet etc.",
        theory:
          "Unit conversion uses simple formulas encapsulated in Python functions. Currency: Dollars = Rupees / rate. Temperature: F = (C * 9/5) + 32. Length: 1 inch = 1/12 feet. Python functions promote code reuse and readability.",
        algorithm:
          "1. Start\n2. Display conversion menu\n3. Read choice and input value\n4. Apply corresponding conversion formula\n5. Print result\n6. Stop",
        flowchart: {
          nodes: [
            { id: "1", type: "start", label: "Start" },
            { id: "2", type: "input", label: "Read choice, value" },
            { id: "3", type: "decision", label: "choice?" },
            { id: "4", type: "process", label: "Apply conversion formula" },
            { id: "5", type: "output", label: "Print result" },
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
          supportedLanguages: ["python"],
          templates: {
            python:
              "def rupees_to_dollars(r, rate=83.5): return r / rate\ndef celsius_to_fahrenheit(c):       return (c * 9/5) + 32\ndef inches_to_feet(i):              return i / 12\n\nif __name__ == '__main__':\n    print('1. Rupees to Dollars  2. Celsius to Fahrenheit  3. Inches to Feet')\n    choice = int(input('Choice: '))\n    val = float(input('Value: '))\n    if choice == 1:   print(f'{val} Rupees = {rupees_to_dollars(val):.4f} Dollars')\n    elif choice == 2: print(f'{val}°C = {celsius_to_fahrenheit(val):.2f}°F')\n    elif choice == 3: print(f'{val} inches = {inches_to_feet(val):.4f} feet')",
          },
        },
        samples: [
          { input: "1\n1000", output: "1000.0 Rupees = 11.9760 Dollars\n" },
          { input: "2\n100", output: "100.0°C = 212.00°F\n" },
        ],
      },
      {
        part: "d",
        title: "Calculating Gross Salary of an Employee",
        concepts: ["Arithmetic Operators", "Variables", "Data Types"],
        hints: [
          "Prompt the user for input and convert the resulting string to a float before calculation.",
          "Compute DA, TA, and HRA using multiplication operators: e.g., da = 0.7 * basic_salary.",
          "Gross salary is the sum of basic salary and all allowances.",
        ],
        problemStatement:
          "Write a Python program to calculate the gross salary of an employee. The program should prompt the user for the basic salary (BS) and then compute the dearness allowance (DA) as 70% of BS, the travel allowance (TA) as 30% of BS, and the house rent allowance (HRA) as 10% of BS. Finally, it should calculate the gross salary as the sum of BS, DA, TA, and HRA and display the result.",
        theory:
          "Salary computation is a classic arithmetic application. DA = 0.70*BS, TA = 0.30*BS, HRA = 0.10*BS, Gross = BS+DA+TA+HRA. Python's float type handles decimal arithmetic. This demonstrates practical use of arithmetic operators, variable assignment, and formatted output.",
        algorithm:
          "1. Start\n2. Read Basic Salary (BS)\n3. DA = 0.70*BS, TA = 0.30*BS, HRA = 0.10*BS\n4. Gross = BS + DA + TA + HRA\n5. Print DA, TA, HRA, Gross\n6. Stop",
        flowchart: {
          nodes: [
            { id: "1", type: "start", label: "Start" },
            { id: "2", type: "input", label: "Read BS" },
            {
              id: "3",
              type: "process",
              label: "DA=0.7*BS; TA=0.3*BS; HRA=0.1*BS",
            },
            { id: "4", type: "process", label: "Gross = BS+DA+TA+HRA" },
            { id: "5", type: "output", label: "Print DA, TA, HRA, Gross" },
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
          supportedLanguages: ["python"],
          templates: {
            python:
              "def calculate_gross_salary(bs):\n    # Write your code here\n    # Compute DA (70%), TA (30%), HRA (10%), return gross = BS+DA+TA+HRA\n    pass\n\nif __name__ == '__main__':\n    bs = float(input('Enter Basic Salary: '))\n    da, ta, hra = 0.70*bs, 0.30*bs, 0.10*bs\n    gross = calculate_gross_salary(bs)\n    print(f'DA  = {da:.2f}')\n    print(f'TA  = {ta:.2f}')\n    print(f'HRA = {hra:.2f}')\n    print(f'Gross Salary = {gross:.2f}')",
          },
        },
        samples: [
          {
            input: "10000",
            output:
              "DA  = 7000.00\nTA  = 3000.00\nHRA = 1000.00\nGross Salary = 21000.00\n",
          },
        ],
      },
      {
        part: "e",
        title: "Calculating Simple Interest",
        concepts: ["Arithmetic Formulas", "User Input", "Type Casting"],
        hints: [
          "Convert input values to float since principal, rate, and time can be decimals.",
          "Implement the formula: Simple Interest = (Principal * Rate * Time) / 100.",
          "Add the interest to the principal to compute the total accumulated amount.",
        ],
        problemStatement:
          "Write a Python program to calculate the simple interest based on user input. The program should prompt the user to enter the principal amount, the rate of interest, and the time period in years. It should then compute the simple interest using the formula Simple Interest=(Principal×Rate×Time)/100 and display the result.",
        theory:
          "Simple Interest SI = (P * R * T) / 100 where P is principal, R is rate (%), T is time in years. Python floats handle decimal arithmetic. This classic beginner program demonstrates user input, arithmetic operators, and formatted output.",
        algorithm:
          "1. Start\n2. Read P, R, T\n3. SI = (P * R * T) / 100\n4. Amount = P + SI\n5. Print SI and Amount\n6. Stop",
        flowchart: {
          nodes: [
            { id: "1", type: "start", label: "Start" },
            { id: "2", type: "input", label: "Read P, R, T" },
            { id: "3", type: "process", label: "SI = (P * R * T) / 100" },
            { id: "4", type: "process", label: "Amount = P + SI" },
            { id: "5", type: "output", label: "Print SI and Amount" },
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
          supportedLanguages: ["python"],
          templates: {
            python:
              "def simple_interest(principal, rate, time):\n    # Write your code here\n    # Return SI = (P * R * T) / 100\n    pass\n\nif __name__ == '__main__':\n    p = float(input('Enter Principal: '))\n    r = float(input('Enter Rate of Interest (%): '))\n    t = float(input('Enter Time (years): '))\n    si = simple_interest(p, r, t)\n    print(f'Simple Interest = {si:.2f}')\n    print(f'Total Amount    = {p + si:.2f}')",
          },
        },
        samples: [
          {
            input: "1000\n5\n2",
            output: "Simple Interest = 100.00\nTotal Amount    = 1100.00\n",
          },
        ],
      },
      {
        part: "f",
        title: "Exploring Basic Arithmetic Operations",
        concepts: [
          "Arithmetic Operators",
          "Division Types",
          "Formatted Outputs",
        ],
        hints: [
          "In Python 3, the '/' operator performs true division and always returns a float.",
          "Use the '%' operator for modulus to obtain the remainder of division.",
          "Try converting inputs to float to allow arithmetic operations on both integers and decimals.",
        ],
        problemStatement:
          "Write a Python program to explore basic arithmetic operations. The program should prompt the user to enter two numbers and then perform addition, subtraction, multiplication, division, and modulus operations on those numbers.",
        theory:
          "Python arithmetic operators: + (add), - (subtract), * (multiply), / (true division, always float), // (floor division), % (modulus), ** (exponentiation). Division in Python 3 always returns a float. This experiment demonstrates operator usage and formatted output.",
        algorithm:
          "1. Start\n2. Read two numbers a and b\n3. Compute a+b, a-b, a*b, a/b, a%b\n4. Print all results\n5. Stop",
        flowchart: {
          nodes: [
            { id: "1", type: "start", label: "Start" },
            { id: "2", type: "input", label: "Read a, b" },
            {
              id: "3",
              type: "process",
              label: "Compute +, -, *, /, % of a and b",
            },
            { id: "4", type: "output", label: "Print all results" },
            { id: "5", type: "end", label: "Stop" },
          ],
          edges: [
            { source: "1", target: "2" },
            { source: "2", target: "3" },
            { source: "3", target: "4" },
            { source: "4", target: "5" },
          ],
        },
        starterCode: {
          supportedLanguages: ["python"],
          templates: {
            python:
              "def arithmetic_operations(a, b):\n    # Write your code here\n    # Print results of +, -, *, /, % operations\n    pass\n\nif __name__ == '__main__':\n    a = float(input('Enter first number: '))\n    b = float(input('Enter second number: '))\n    arithmetic_operations(a, b)",
          },
        },
        samples: [
          {
            input: "10\n3",
            output:
              "Addition: 13.0\nSubtraction: 7.0\nMultiplication: 30.0\nDivision: 3.3333333333333335\nModulus: 1.0\n",
          },
        ],
      },
    ],
  },

  // ── Exp 2: Data Structures ────────────────────────────────────────────────────
  {
    _id: new ObjectId("685b2a1f3c4e8d0012a7b602"),
    subjectId: new ObjectId("685b2a1f3c4e8d0012a7b003"),
    experimentNumber: 2,
    subExperiments: [
      {
        part: "a",
        title: "Task List Manager",
        concepts: ["Lists", "Mutable Sequences", "Interactive Menus"],
        hints: [
          "Use a Python list to store tasks; append() adds tasks, and remove() deletes them.",
          "Use index lookup with lists to locate and update a specific task by value.",
          "Use the sort() method to arrange tasks in alphabetical order in-place.",
        ],
        problemStatement:
          "Develop a Python program to manage a task list using lists and tuples, including adding, removing, updating, and sorting tasks.",
        theory:
          "Python lists are mutable ordered sequences supporting append(), remove(), insert(), sort(), and pop(). Tuples are immutable ordered sequences. sorted() returns a new sorted list. List comprehensions provide concise filtering syntax. These are the most fundamental Python data structures.",
        algorithm:
          "1. Start\n2. Initialize tasks = []\n3. Display menu: Add/Remove/Update/View/Sort/Quit\n4. Read choice and perform operation\n5. Repeat until Quit\n6. Stop",
        flowchart: {
          nodes: [
            { id: "1", type: "start", label: "Start" },
            { id: "2", type: "process", label: "tasks = []" },
            { id: "3", type: "input", label: "Read choice" },
            { id: "4", type: "decision", label: "Quit?" },
            { id: "5", type: "process", label: "Perform operation" },
            { id: "6", type: "output", label: "Display tasks" },
            { id: "7", type: "end", label: "Stop" },
          ],
          edges: [
            { source: "1", target: "2" },
            { source: "2", target: "3" },
            { source: "3", target: "4" },
            { source: "4", target: "7", label: "Yes" },
            { source: "4", target: "5", label: "No" },
            { source: "5", target: "6" },
            { source: "6", target: "3" },
          ],
        },
        starterCode: {
          supportedLanguages: ["python"],
          templates: {
            python:
              "def add_task(tasks, task):              tasks.append(task)\ndef remove_task(tasks, task):           tasks.remove(task) if task in tasks else print('Not found')\ndef update_task(tasks, old, new):       tasks[tasks.index(old)] = new if old in tasks else None\ndef sort_tasks(tasks):                  tasks.sort()\n\nif __name__ == '__main__':\n    tasks = []\n    while True:\n        print('1-Add 2-Remove 3-Update 4-View 5-Sort 6-Quit')\n        c = int(input('Choice: '))\n        if c == 6: break\n        elif c == 1: add_task(tasks, input('Task: '))\n        elif c == 2: remove_task(tasks, input('Task to remove: '))\n        elif c == 3: update_task(tasks, input('Old: '), input('New: '))\n        elif c == 4: print('Tasks:', tasks)\n        elif c == 5: sort_tasks(tasks); print('Sorted:', tasks)",
          },
        },
        samples: [
          {
            input: "1\nBuy groceries\n1\nRead book\n5\n4\n6",
            output:
              "Sorted: ['Buy groceries', 'Read book']\nTasks: ['Buy groceries', 'Read book']\n",
          },
        ],
      },
      {
        part: "b",
        title: "Student Enrollment Manager",
        concepts: ["Sets", "Set Operations", "Unordered Collections"],
        hints: [
          "Use curly braces {} or set() to define a set of student names.",
          "Perform set operations: '|' for union, '&' for intersection, and '-' for set difference.",
          "Remember that sets automatically eliminate duplicate entries.",
        ],
        problemStatement:
          "Create a Python code to demonstrate the use of sets and perform set operations (union, intersection, difference) to manage student enrollments in multiple courses / appearing for multiple entrance exams like CET, JEE, NEET etc.",
        theory:
          "Python sets are unordered collections of unique elements. Operations: union (|), intersection (&), difference (-), symmetric_difference (^). Sets automatically eliminate duplicates. add(), discard() modify sets. Ideal for membership testing and enrollment management.",
        algorithm:
          "1. Start\n2. Create sets for CET, JEE, NEET enrollments\n3. Compute union: all students\n4. Compute intersection: students in all exams\n5. Compute difference: students only in one exam\n6. Print results\n7. Stop",
        flowchart: {
          nodes: [
            { id: "1", type: "start", label: "Start" },
            {
              id: "2",
              type: "input",
              label: "Read student sets for CET, JEE, NEET",
            },
            { id: "3", type: "process", label: "union = CET | JEE | NEET" },
            {
              id: "4",
              type: "process",
              label: "intersection = CET & JEE & NEET",
            },
            { id: "5", type: "process", label: "only_cet = CET - JEE - NEET" },
            { id: "6", type: "output", label: "Print results" },
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
          supportedLanguages: ["python"],
          templates: {
            python:
              "def enrollment_operations(cet, jee, neet):\n    # Write your code here\n    # Compute and print union, intersection, and difference\n    pass\n\nif __name__ == '__main__':\n    cet  = {'Alice', 'Bob', 'Carol', 'Dave'}\n    jee  = {'Bob', 'Carol', 'Eve', 'Frank'}\n    neet = {'Carol', 'Dave', 'Eve', 'Grace'}\n    enrollment_operations(cet, jee, neet)",
          },
        },
        samples: [
          {
            input: "",
            output:
              "Union (all students): 7\nIntersection (all exams): {'Carol'}\nOnly CET: {'Alice'}\n",
          },
        ],
      },
      {
        part: "c",
        title: "Student Record Keeper",
        concepts: ["Dictionaries", "Key-Value Stores", "Nested Structures"],
        hints: [
          "Use a dictionary where the student's roll number or ID serves as the unique key.",
          "Values can be another nested dictionary containing student attributes like grade and attendance.",
          "Use the items() method of a dictionary to iterate over key-value pairs simultaneously.",
        ],
        problemStatement:
          "Write a Python program to create, update, and manipulate a dictionary of student records, including their grades and attendance.",
        theory:
          "Python dictionaries are mutable key-value stores. dict[key]=value adds/updates, del dict[key] removes, dict.get(key) safely retrieves. dict.items() iterates key-value pairs. Nested dictionaries store complex records like student data.",
        algorithm:
          "1. Start\n2. Initialize records = {}\n3. add_student(roll, name, grade, attendance)\n4. update_grade(roll, new_grade)\n5. display_records() — iterate and print all\n6. Stop",
        flowchart: {
          nodes: [
            { id: "1", type: "start", label: "Start" },
            { id: "2", type: "process", label: "records = {}" },
            { id: "3", type: "input", label: "Read operation" },
            { id: "4", type: "decision", label: "Quit?" },
            {
              id: "5",
              type: "process",
              label: "Add/Update/Delete/View record",
            },
            { id: "6", type: "end", label: "Stop" },
          ],
          edges: [
            { source: "1", target: "2" },
            { source: "2", target: "3" },
            { source: "3", target: "4" },
            { source: "4", target: "6", label: "Yes" },
            { source: "4", target: "5", label: "No" },
            { source: "5", target: "3" },
          ],
        },
        starterCode: {
          supportedLanguages: ["python"],
          templates: {
            python:
              "def add_student(records, roll, name, grade, attendance):\n    # Write your code here\n    pass\n\ndef update_grade(records, roll, new_grade):\n    # Write your code here\n    pass\n\ndef display_records(records):\n    # Write your code here\n    # Print roll, name, grade, attendance for each student\n    pass\n\nif __name__ == '__main__':\n    records = {}\n    add_student(records, 101, 'Alice', 'A', 95)\n    add_student(records, 102, 'Bob', 'B', 80)\n    update_grade(records, 102, 'A')\n    display_records(records)",
          },
        },
        samples: [
          {
            input: "",
            output:
              "Roll: 101 | Name: Alice | Grade: A  | Attendance: 95%\nRoll: 102 | Name: Bob   | Grade: A  | Attendance: 80%\n",
          },
        ],
      },
    ],
  },

  // ── Exp 3: Control Structures & Functions ─────────────────────────────────────
  {
    _id: new ObjectId("685b2a1f3c4e8d0012a7b603"),
    subjectId: new ObjectId("685b2a1f3c4e8d0012a7b003"),
    experimentNumber: 3,
    subExperiments: [
      {
        part: "a",
        title: "Triangle Pattern Generator Using Loops",
        concepts: [
          "Nested Loops",
          "String Multiplication",
          "Indentation in Python",
        ],
        hints: [
          "Python supports string multiplication (e.g. '*' * 5) which simplifies printing repetitive patterns.",
          "Use the range(1, n+1) function in a for loop to iterate from 1 up to 'n' inclusive.",
          "Ensure proper indentation, as Python uses whitespace instead of curly braces to define blocks.",
        ],
        problemStatement:
          "Write a Python program to print a triangle pattern (give any), emphasizing the transition from C to Python syntax.",
        theory:
          "Python uses indentation instead of curly braces. The for loop iterates over range(n). String multiplication ('* ' * i) simplifies pattern printing. Unlike C, Python's range() is exclusive at the end. This highlights key syntax differences between C and Python.",
        algorithm:
          "1. Start\n2. Read n (rows)\n3. For i = 1 to n: print '* ' repeated i times\n4. Stop",
        flowchart: {
          nodes: [
            { id: "1", type: "start", label: "Start" },
            { id: "2", type: "input", label: "Read n" },
            { id: "3", type: "process", label: "i = 1" },
            { id: "4", type: "decision", label: "i <= n?" },
            { id: "5", type: "output", label: "Print '* ' * i" },
            { id: "6", type: "process", label: "i++" },
            { id: "7", type: "end", label: "Stop" },
          ],
          edges: [
            { source: "1", target: "2" },
            { source: "2", target: "3" },
            { source: "3", target: "4" },
            { source: "4", target: "5", label: "Yes" },
            { source: "4", target: "7", label: "No" },
            { source: "5", target: "6" },
            { source: "6", target: "4" },
          ],
        },
        starterCode: {
          supportedLanguages: ["python"],
          templates: {
            python:
              "def print_triangle(n):\n    # Write your code here\n    # Print right-angled triangle of n rows using *\n    pass\n\nif __name__ == '__main__':\n    n = int(input('Enter number of rows: '))\n    print_triangle(n)",
          },
        },
        samples: [
          { input: "5", output: "*\n* *\n* * *\n* * * *\n* * * * *\n" },
        ],
      },
      {
        part: "b",
        title: "Number Type Identifier",
        concepts: [
          "Conditional Statements",
          "Modulus Operator",
          "Type Casting",
        ],
        hints: [
          "Check if a number is even by testing if n % 2 == 0.",
          "Use if-else statements to execute different print blocks based on the check.",
          "Convert user input using int() to perform mathematical operations.",
        ],
        problemStatement:
          "Develop a Python program that takes a numerical input and identifies whether it is even or odd, utilizing conditional statements and loops.",
        theory:
          "The modulus operator % gives the remainder of division. If n % 2 == 0 the number is even, otherwise odd. Python conditionals use if/elif/else without parentheses around conditions. int() converts string input to integer.",
        algorithm:
          "1. Start\n2. Read number n\n3. If n % 2 == 0: print Even\n4. Else: print Odd\n5. Stop",
        flowchart: {
          nodes: [
            { id: "1", type: "start", label: "Start" },
            { id: "2", type: "input", label: "Read n" },
            { id: "3", type: "decision", label: "n % 2 == 0?" },
            { id: "4", type: "output", label: "Print Even" },
            { id: "5", type: "output", label: "Print Odd" },
            { id: "6", type: "end", label: "Stop" },
          ],
          edges: [
            { source: "1", target: "2" },
            { source: "2", target: "3" },
            { source: "3", target: "4", label: "Yes" },
            { source: "3", target: "5", label: "No" },
            { source: "4", target: "6" },
            { source: "5", target: "6" },
          ],
        },
        starterCode: {
          supportedLanguages: ["python"],
          templates: {
            python:
              "def identify_number(n):\n    # Write your code here\n    # Return 'Even' or 'Odd'\n    pass\n\nif __name__ == '__main__':\n    n = int(input('Enter a number: '))\n    print(f'{n} is {identify_number(n)}')",
          },
        },
        samples: [
          { input: "7", output: "7 is Odd\n" },
          { input: "12", output: "12 is Even\n" },
        ],
      },
      {
        part: "c",
        title: "Character Type Identifier",
        concepts: [
          "String Built-in Methods",
          "Conditional Ladders",
          "ASCII Checks",
        ],
        hints: [
          "Use built-in string methods like ch.isdigit(), ch.islower(), and ch.isupper() for checks.",
          "Structure the code using an if-elif-else ladder to evaluate each character classification.",
          "If all isdigit(), islower(), and isupper() return False, classify the character as a special character.",
        ],
        problemStatement:
          "Create a Python program to check whether the given input is a digit, lowercase character, uppercase character, or a special character using an 'if-else' ladder.",
        theory:
          "Python's str class provides built-in methods: isdigit(), islower(), isupper(). If none apply, the character is special. This avoids C-style ASCII range checks and demonstrates Python's clean string API.",
        algorithm:
          "1. Start\n2. Read character ch\n3. If ch.isdigit(): print Digit\n4. Elif ch.islower(): print Lowercase\n5. Elif ch.isupper(): print Uppercase\n6. Else: print Special Character\n7. Stop",
        flowchart: {
          nodes: [
            { id: "1", type: "start", label: "Start" },
            { id: "2", type: "input", label: "Read ch" },
            { id: "3", type: "decision", label: "ch.isdigit()?" },
            { id: "4", type: "output", label: "Digit" },
            { id: "5", type: "decision", label: "ch.islower()?" },
            { id: "6", type: "output", label: "Lowercase" },
            { id: "7", type: "decision", label: "ch.isupper()?" },
            { id: "8", type: "output", label: "Uppercase" },
            { id: "9", type: "output", label: "Special Character" },
            { id: "10", type: "end", label: "Stop" },
          ],
          edges: [
            { source: "1", target: "2" },
            { source: "2", target: "3" },
            { source: "3", target: "4", label: "Yes" },
            { source: "3", target: "5", label: "No" },
            { source: "4", target: "10" },
            { source: "5", target: "6", label: "Yes" },
            { source: "5", target: "7", label: "No" },
            { source: "6", target: "10" },
            { source: "7", target: "8", label: "Yes" },
            { source: "7", target: "9", label: "No" },
            { source: "8", target: "10" },
            { source: "9", target: "10" },
          ],
        },
        starterCode: {
          supportedLanguages: ["python"],
          templates: {
            python:
              "def identify_character(ch):\n    # Write your code here\n    # Return 'Digit', 'Lowercase', 'Uppercase', or 'Special Character'\n    pass\n\nif __name__ == '__main__':\n    ch = input('Enter a character: ')\n    print(identify_character(ch))",
          },
        },
        samples: [
          { input: "A", output: "Uppercase\n" },
          { input: "5", output: "Digit\n" },
          { input: "@", output: "Special Character\n" },
        ],
      },
      {
        part: "d",
        title: "Multiplication Table Generator",
        concepts: ["Loop Control Structures", "Range Function", "f-strings"],
        hints: [
          "Use range(1, 11) to generate numbers from 1 to 10 for the multiplication table.",
          "Format the output statement inside the loop using f-strings for clean layout (e.g. f'{n} x {i} = {n*i}').",
          "An iterative for loop is more readable than a while loop for this scenario.",
        ],
        problemStatement:
          "Write a Python program to take a numerical input from the user and generate its multiplication table using loops.",
        theory:
          "Multiplication tables are generated by iterating a range with for i in range(1, 11). f-strings produce formatted output. This contrasts with C's printf-based approach, demonstrating Python's cleaner loop and output syntax.",
        algorithm:
          "1. Start\n2. Read n\n3. For i = 1 to 10: print n x i = n*i\n4. Stop",
        flowchart: {
          nodes: [
            { id: "1", type: "start", label: "Start" },
            { id: "2", type: "input", label: "Read n" },
            { id: "3", type: "process", label: "i = 1" },
            { id: "4", type: "decision", label: "i <= 10?" },
            { id: "5", type: "output", label: "Print n x i = n*i" },
            { id: "6", type: "process", label: "i++" },
            { id: "7", type: "end", label: "Stop" },
          ],
          edges: [
            { source: "1", target: "2" },
            { source: "2", target: "3" },
            { source: "3", target: "4" },
            { source: "4", target: "5", label: "Yes" },
            { source: "4", target: "7", label: "No" },
            { source: "5", target: "6" },
            { source: "6", target: "4" },
          ],
        },
        starterCode: {
          supportedLanguages: ["python"],
          templates: {
            python:
              "def multiplication_table(n):\n    # Write your code here\n    # Print multiplication table for n (1 to 10)\n    pass\n\nif __name__ == '__main__':\n    n = int(input('Enter a number: '))\n    multiplication_table(n)",
          },
        },
        samples: [
          {
            input: "5",
            output:
              "5 x 1 = 5\n5 x 2 = 10\n5 x 3 = 15\n5 x 4 = 20\n5 x 5 = 25\n5 x 6 = 30\n5 x 7 = 35\n5 x 8 = 40\n5 x 9 = 45\n5 x 10 = 50\n",
          },
        ],
      },
      {
        part: "e",
        title: "Fibonacci Sequence Generator",
        concepts: [
          "While Loops",
          "Multiple Assignment",
          "Arbitrary-Precision Integers",
        ],
        hints: [
          "Initialize two variables, a = 0 and b = 1, to represent the first two numbers of the sequence.",
          "Use Python's multiple assignment feature: 'a, b = b, a + b' to update variables in a single line.",
          "Use a loop counter or check if the sequence length has reached the target 'n'.",
        ],
        problemStatement:
          "Develop a Python program to print the Fibonacci sequence using a while loop.",
        theory:
          "Fibonacci: each number is the sum of the two preceding ones (0, 1, 1, 2, 3, 5...). Python's multiple assignment (a, b = b, a+b) makes it elegant. Python's arbitrary-precision integers handle very large Fibonacci numbers without overflow.",
        algorithm:
          "1. Start\n2. Read n\n3. a=0, b=1, count=0\n4. While count < n: print a; a,b = b,a+b; count++\n5. Stop",
        flowchart: {
          nodes: [
            { id: "1", type: "start", label: "Start" },
            { id: "2", type: "input", label: "Read n" },
            { id: "3", type: "process", label: "a=0, b=1, count=0" },
            { id: "4", type: "decision", label: "count < n?" },
            { id: "5", type: "output", label: "Print a" },
            { id: "6", type: "process", label: "a,b = b,a+b; count++" },
            { id: "7", type: "end", label: "Stop" },
          ],
          edges: [
            { source: "1", target: "2" },
            { source: "2", target: "3" },
            { source: "3", target: "4" },
            { source: "4", target: "5", label: "Yes" },
            { source: "4", target: "7", label: "No" },
            { source: "5", target: "6" },
            { source: "6", target: "4" },
          ],
        },
        starterCode: {
          supportedLanguages: ["python"],
          templates: {
            python:
              "def fibonacci(n):\n    # Write your code here\n    # Print first n terms using a while loop\n    pass\n\nif __name__ == '__main__':\n    n = int(input('Enter number of terms: '))\n    fibonacci(n)",
          },
        },
        samples: [{ input: "8", output: "0\n1\n1\n2\n3\n5\n8\n13\n" }],
      },
      {
        part: "f",
        title: "Factorial Generator",
        concepts: ["Iterative Loops", "Recursion", "Big Integers"],
        hints: [
          "Use a loop that multiplies a running product variable by each number from 1 to N.",
          "Handle the base case: the factorial of 0 is defined as 1.",
          "Python handles arbitrary-precision integers automatically, so you don't need to worry about overflow.",
        ],
        problemStatement:
          "Design a Python program to compute the factorial of a given integer N.",
        theory:
          "Factorial n! = 1*2*...*n; 0!=1 by definition. Python integers have arbitrary precision so no overflow occurs unlike C. Both iterative (loop) and recursive approaches have O(n) time. math.factorial() provides a built-in implementation.",
        algorithm:
          "1. Start\n2. Read N\n3. fact=1, i=1\n4. While i<=N: fact*=i; i++\n5. Print fact\n6. Stop",
        flowchart: {
          nodes: [
            { id: "1", type: "start", label: "Start" },
            { id: "2", type: "input", label: "Read N" },
            { id: "3", type: "process", label: "fact=1, i=1" },
            { id: "4", type: "decision", label: "i <= N?" },
            { id: "5", type: "process", label: "fact *= i; i++" },
            { id: "6", type: "output", label: "Print fact" },
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
          supportedLanguages: ["python"],
          templates: {
            python:
              "def factorial(n):\n    # Write your code here\n    # Return n! (iterative)\n    pass\n\nif __name__ == '__main__':\n    n = int(input('Enter N: '))\n    print(f'{n}! = {factorial(n)}')",
          },
        },
        samples: [
          { input: "5", output: "5! = 120\n" },
          { input: "10", output: "10! = 3628800\n" },
        ],
      },
      {
        part: "g",
        title: "Prime Number Analyzer",
        concepts: [
          "Prime Numbers",
          "Algorithm Optimization",
          "Modulo Arithmetic",
        ],
        hints: [
          "A prime number is greater than 1 and has no positive divisors other than 1 and itself.",
          "Optimize search by checking for factors only up to the square root of the number (use math.isqrt or math.sqrt).",
          "Immediately return False (not prime) if a factor is found; otherwise return True after the loop.",
        ],
        problemStatement:
          "Using function, write a Python program to analyze the input number is prime or not.",
        theory:
          "A prime is divisible only by 1 and itself. Test divisibility from 2 to √n — if any divisor found, not prime. Time: O(√n). Encapsulating in a function promotes reuse. 2 is the only even prime.",
        algorithm:
          "1. Start\n2. Read n\n3. If n<2: not prime\n4. For i=2 to sqrt(n): if n%i==0, not prime\n5. Else: prime\n6. Print result\n7. Stop",
        flowchart: {
          nodes: [
            { id: "1", type: "start", label: "Start" },
            { id: "2", type: "input", label: "Read n" },
            { id: "3", type: "decision", label: "n < 2?" },
            { id: "4", type: "output", label: "Not Prime" },
            { id: "5", type: "decision", label: "n % i == 0? (i=2..sqrt(n))" },
            { id: "6", type: "output", label: "Not Prime" },
            { id: "7", type: "output", label: "Prime" },
            { id: "8", type: "end", label: "Stop" },
          ],
          edges: [
            { source: "1", target: "2" },
            { source: "2", target: "3" },
            { source: "3", target: "4", label: "Yes" },
            { source: "3", target: "5", label: "No" },
            { source: "4", target: "8" },
            { source: "5", target: "6", label: "Yes" },
            { source: "5", target: "7", label: "No divisor" },
            { source: "6", target: "8" },
            { source: "7", target: "8" },
          ],
        },
        starterCode: {
          supportedLanguages: ["python"],
          templates: {
            python:
              "import math\n\ndef is_prime(n):\n    # Write your code here\n    # Return True if n is prime, False otherwise\n    pass\n\nif __name__ == '__main__':\n    n = int(input('Enter a number: '))\n    print(f'{n} is {\"Prime\" if is_prime(n) else \"Not Prime\"}')",
          },
        },
        samples: [
          { input: "17", output: "17 is Prime\n" },
          { input: "15", output: "15 is Not Prime\n" },
        ],
      },
      {
        part: "h",
        title: "Simple Calculator Using Functions",
        concepts: [
          "Functions as First-Class Citizens",
          "Dictionaries",
          "Arithmetic Operations",
        ],
        hints: [
          "Define helper functions for basic arithmetic tasks: addition, subtraction, multiplication, and division.",
          "Use a dictionary mapping operator strings (e.g., '+', '/') to function objects for clean dispatch.",
          "Check for division by zero using conditionals or try-except blocks in the division function.",
        ],
        problemStatement:
          "Implement a simple Python calculator that takes user input and performs basic arithmetic operations (addition, subtraction, multiplication, division) using functions.",
        theory:
          "Python functions are defined with def. A dispatch table (dict of functions) replaces if-else chains for operation selection. Division should handle ZeroDivisionError using try-except. This demonstrates modularity, function objects, and exception handling.",
        algorithm:
          "1. Define add(a,b), subtract(a,b), multiply(a,b), divide(a,b)\n2. Read a, operator, b\n3. Look up operator in dispatch dict\n4. Call function; print result\n5. Stop",
        flowchart: {
          nodes: [
            { id: "1", type: "start", label: "Start" },
            { id: "2", type: "input", label: "Read a, op, b" },
            { id: "3", type: "decision", label: "op valid?" },
            { id: "4", type: "process", label: "Call ops[op](a, b)" },
            { id: "5", type: "output", label: "Print result" },
            { id: "6", type: "output", label: "Invalid operator" },
            { id: "7", type: "end", label: "Stop" },
          ],
          edges: [
            { source: "1", target: "2" },
            { source: "2", target: "3" },
            { source: "3", target: "4", label: "Yes" },
            { source: "3", target: "6", label: "No" },
            { source: "4", target: "5" },
            { source: "5", target: "7" },
            { source: "6", target: "7" },
          ],
        },
        starterCode: {
          supportedLanguages: ["python"],
          templates: {
            python:
              "def add(a, b):      return a + b\ndef subtract(a, b): return a - b\ndef multiply(a, b): return a * b\ndef divide(a, b):\n    # Write your code here: handle ZeroDivisionError\n    pass\n\nif __name__ == '__main__':\n    a  = float(input('First number: '))\n    op = input('Operator (+, -, *, /): ')\n    b  = float(input('Second number: '))\n    ops = {'+': add, '-': subtract, '*': multiply, '/': divide}\n    if op in ops: print(f'Result: {ops[op](a, b)}')\n    else: print('Invalid operator')",
          },
        },
        samples: [
          { input: "10\n+\n5", output: "Result: 15.0\n" },
          { input: "10\n/\n0", output: "Error: Division by zero\n" },
        ],
      },
      {
        part: "i",
        title: "Interactive Guessing Game",
        concepts: ["Random Module", "Infinite Loops", "Conditional Branches"],
        hints: [
          "Import the random module and use random.randint(1, 100) to generate the target number.",
          "Use an infinite loop ('while True') and terminate it using 'break' when the user guesses correctly.",
          "Compare the user's guess to the secret number and print feedback like 'Too High' or 'Too Low'.",
        ],
        problemStatement:
          "Develop a number guessing game where the program generates a random number, and the user has to guess it. Implement loops and conditional statements for user interaction.",
        theory:
          "random.randint(1, 100) generates a random integer. A while loop keeps the game running until the correct guess. Conditional statements provide Too Low / Too High hints. An attempts counter tracks performance. Demonstrates random number generation, loops, and conditionals.",
        algorithm:
          "1. secret = random.randint(1,100)\n2. attempts=0\n3. While True:\n   a. Read guess; attempts++\n   b. If guess<secret: Too Low\n   c. Elif guess>secret: Too High\n   d. Else: print Correct and attempts; break",
        flowchart: {
          nodes: [
            { id: "1", type: "start", label: "Start" },
            { id: "2", type: "process", label: "secret = randint(1,100)" },
            { id: "3", type: "input", label: "Read guess" },
            { id: "4", type: "decision", label: "guess == secret?" },
            { id: "5", type: "output", label: "Print Correct + attempts" },
            { id: "6", type: "decision", label: "guess < secret?" },
            { id: "7", type: "output", label: "Too Low" },
            { id: "8", type: "output", label: "Too High" },
            { id: "9", type: "end", label: "Stop" },
          ],
          edges: [
            { source: "1", target: "2" },
            { source: "2", target: "3" },
            { source: "3", target: "4" },
            { source: "4", target: "5", label: "Yes" },
            { source: "4", target: "6", label: "No" },
            { source: "5", target: "9" },
            { source: "6", target: "7", label: "Yes" },
            { source: "6", target: "8", label: "No" },
            { source: "7", target: "3" },
            { source: "8", target: "3" },
          ],
        },
        starterCode: {
          supportedLanguages: ["python"],
          templates: {
            python:
              "import random\n\ndef guessing_game():\n    secret = random.randint(1, 100)\n    attempts = 0\n    print('Guess a number between 1 and 100.')\n    # Write your code here\n    # Loop until correct; give Too Low/Too High hints; print attempts on win\n\nif __name__ == '__main__':\n    guessing_game()",
          },
        },
        samples: [
          {
            input: "50\n75\n63",
            output:
              "Too Low!\nToo High!\nCorrect! You guessed it in 3 attempts.\n",
          },
        ],
      },
    ],
  },

  // ── Exp 4: File Handling ──────────────────────────────────────────────────────
  {
    _id: new ObjectId("685b2a1f3c4e8d0012a7b604"),
    subjectId: new ObjectId("685b2a1f3c4e8d0012a7b003"),
    experimentNumber: 4,
    subExperiments: [
      {
        part: "a",
        title: "Extracting Words from Text File",
        concepts: ["File I/O", "String Methods", "List Comprehensions"],
        hints: [
          "Use the 'with open(filename, 'r') as file:' context manager to safely open and read files.",
          "Read file contents using file.read() and split into words using split().",
          "Strip punctuation marks from words using string.strip() to clean the extracted data.",
        ],
        problemStatement:
          "Develop a Python program that reads a text file and prints words of specified lengths (e.g., three, four, five, etc.) found within the file.",
        theory:
          "Python open() with 'r' mode reads text files. split() splits content into words. len(word) gives word length. List comprehensions [w for w in words if len(w)==n] filter by length. The with statement auto-closes files (context manager).",
        algorithm:
          "1. Open file in read mode\n2. Read all content; split into words\n3. Read target length n\n4. Filter words where len(word)==n\n5. Print filtered words",
        flowchart: {
          nodes: [
            { id: "1", type: "start", label: "Start" },
            { id: "2", type: "input", label: "Read filename, target_length" },
            {
              id: "3",
              type: "process",
              label: "Open file; read and split into words",
            },
            { id: "4", type: "process", label: "Filter words by length" },
            { id: "5", type: "output", label: "Print filtered words" },
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
          supportedLanguages: ["python"],
          templates: {
            python:
              "def extract_words_by_length(filename, length):\n    # Write your code here\n    # Open file, split into words, return list of words with given length\n    pass\n\nif __name__ == '__main__':\n    filename = input('Enter filename: ')\n    length = int(input('Enter word length: '))\n    words = extract_words_by_length(filename, length)\n    print(f'Words of length {length}: {words}')",
          },
        },
        samples: [
          {
            input: "sample.txt\n4",
            output:
              "Words of length 4: ['This', 'text', 'file', 'with', 'many']\n",
          },
        ],
      },
      {
        part: "b",
        title: "Finding Closest Points in 3D Coordinates from CSV",
        concepts: ["CSV Processing", "Euclidean Distance", "Optimization"],
        hints: [
          "Use Python's built-in csv module (csv.reader) to read coordinate rows from a file.",
          "Implement the 3D distance formula: d = sqrt((x2-x1)^2 + (y2-y1)^2 + (z2-z1)^2).",
          "Use nested loops to calculate distances between all pairs of coordinates and track the minimum.",
        ],
        problemStatement:
          "Write a python code to take a csv file as input with coordinates of points in three dimensions. Find out the two closest points.",
        theory:
          "Euclidean distance in 3D: √((x2-x1)²+(y2-y1)²+(z2-z1)²). Python's csv module reads CSV files. itertools.combinations() generates all unique pairs. math.dist() computes n-dimensional distance. Brute-force O(n²) approach checks all pairs.",
        algorithm:
          "1. Read CSV into list of (x,y,z) tuples\n2. For all pairs (p1,p2): compute Euclidean distance\n3. Track pair with minimum distance\n4. Print closest pair and distance",
        flowchart: {
          nodes: [
            { id: "1", type: "start", label: "Start" },
            { id: "2", type: "input", label: "Read CSV filename" },
            { id: "3", type: "process", label: "Parse CSV into points list" },
            {
              id: "4",
              type: "process",
              label: "For each pair: compute distance",
            },
            { id: "5", type: "decision", label: "dist < min_dist?" },
            {
              id: "6",
              type: "process",
              label: "Update min_dist and closest pair",
            },
            {
              id: "7",
              type: "output",
              label: "Print closest pair and distance",
            },
            { id: "8", type: "end", label: "Stop" },
          ],
          edges: [
            { source: "1", target: "2" },
            { source: "2", target: "3" },
            { source: "3", target: "4" },
            { source: "4", target: "5" },
            { source: "5", target: "6", label: "Yes" },
            { source: "5", target: "7", label: "No more pairs" },
            { source: "6", target: "4" },
            { source: "7", target: "8" },
          ],
        },
        starterCode: {
          supportedLanguages: ["python"],
          templates: {
            python:
              "import csv, math\nfrom itertools import combinations\n\ndef read_points(filename):\n    # Write your code here: return list of (x,y,z) tuples from CSV\n    pass\n\ndef find_closest(points):\n    # Write your code here: return (p1, p2, distance) with minimum distance\n    pass\n\nif __name__ == '__main__':\n    filename = input('CSV filename: ')\n    points = read_points(filename)\n    p1, p2, dist = find_closest(points)\n    print(f'Closest: {p1} and {p2}')\n    print(f'Distance: {dist:.4f}')",
          },
        },
        samples: [
          {
            input: "points.csv",
            output:
              "Closest: (1.0, 2.0, 3.0) and (1.5, 2.5, 3.5)\nDistance: 0.8660\n",
          },
        ],
      },
      {
        part: "c",
        title: "Sorting City Names from File",
        concepts: ["File Operations", "Sorting Lists", "Writing Files"],
        hints: [
          "Read city names from an input file, storing each line as an item in a list.",
          "Use the strip() method to remove trailing newline characters from each name.",
          "Sort the list in-place using sort() and write the sorted names to a new output file.",
        ],
        problemStatement:
          "Write a python code to take a file which contains city names on each line. Alphabetically sort the city names and write it in another file.",
        theory:
          "open() with 'r' reads and 'w' writes files. strip() removes trailing newlines. sorted() sorts a list alphabetically. writelines() writes a list to a file. This demonstrates reading, processing, and writing files — a fundamental data processing pattern.",
        algorithm:
          "1. Open input file; read all lines, strip whitespace\n2. Sort cities alphabetically\n3. Open output file in write mode\n4. Write each city on a new line\n5. Print confirmation",
        flowchart: {
          nodes: [
            { id: "1", type: "start", label: "Start" },
            {
              id: "2",
              type: "input",
              label: "Read input filename, output filename",
            },
            { id: "3", type: "process", label: "Read cities from input file" },
            { id: "4", type: "process", label: "Sort alphabetically" },
            {
              id: "5",
              type: "process",
              label: "Write sorted cities to output file",
            },
            { id: "6", type: "output", label: "Print success message" },
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
          supportedLanguages: ["python"],
          templates: {
            python:
              "def sort_cities(input_file, output_file):\n    # Write your code here\n    # Read cities, sort, write to output file\n    pass\n\nif __name__ == '__main__':\n    inp = input('Input filename: ')\n    out = input('Output filename: ')\n    sort_cities(inp, out)\n    print(f'Sorted cities written to {out}')",
          },
        },
        samples: [
          {
            input: "cities.txt\nsorted.txt",
            output: "Sorted cities written to sorted.txt\n",
          },
        ],
      },
      {
        part: "d",
        title: "Building an Executable File",
        concepts: [
          "PyInstaller",
          "Python Scripts packaging",
          "Command-line Utilities",
        ],
        hints: [
          "Use tools like PyInstaller to bundle your Python script and all dependencies into a single executable.",
          "Run 'pyinstaller --onefile script.py' in the terminal to package it as a single file.",
          "Verify that the executable works in environments without a Python interpreter installed.",
        ],
        problemStatement:
          "Create a executable file for any program developed in earlier practical.",
        theory:
          "PyInstaller converts Python scripts to standalone executables. Command: pyinstaller --onefile script.py creates a single .exe (Windows) or binary (Linux/macOS) in the dist/ folder. The --onefile flag bundles all dependencies. Useful for distributing programs to users without Python installed.",
        algorithm:
          "1. Install PyInstaller: pip install pyinstaller\n2. Choose a Python script from earlier experiments\n3. Run: pyinstaller --onefile --name MyProgram script.py\n4. Find executable in dist/ folder\n5. Run executable to verify",
        flowchart: {
          nodes: [
            { id: "1", type: "start", label: "Start" },
            { id: "2", type: "process", label: "pip install pyinstaller" },
            { id: "3", type: "input", label: "Choose Python script" },
            {
              id: "4",
              type: "process",
              label: "pyinstaller --onefile script.py",
            },
            { id: "5", type: "decision", label: "Build successful?" },
            { id: "6", type: "output", label: "Executable in dist/" },
            { id: "7", type: "process", label: "Fix errors, retry" },
            { id: "8", type: "end", label: "Stop" },
          ],
          edges: [
            { source: "1", target: "2" },
            { source: "2", target: "3" },
            { source: "3", target: "4" },
            { source: "4", target: "5" },
            { source: "5", target: "6", label: "Yes" },
            { source: "5", target: "7", label: "No" },
            { source: "7", target: "4" },
            { source: "6", target: "8" },
          ],
        },
        starterCode: {
          supportedLanguages: ["python"],
          templates: {
            python:
              "# Steps to create an executable:\n# 1. pip install pyinstaller\n# 2. pyinstaller --onefile --name MyCalculator calculator.py\n# 3. Run dist/MyCalculator(.exe)\n\n# Sample program to package:\ndef simple_calculator():\n    a = float(input('First number: '))\n    op = input('Operator (+,-,*,/): ')\n    b = float(input('Second number: '))\n    if op == '+':          print(f'Result: {a+b}')\n    elif op == '-':        print(f'Result: {a-b}')\n    elif op == '*':        print(f'Result: {a*b}')\n    elif op == '/' and b:  print(f'Result: {a/b}')\n    else:                  print('Invalid input')\n\nif __name__ == '__main__':\n    simple_calculator()",
          },
        },
        samples: [{ input: "10\n+\n5", output: "Result: 15.0\n" }],
      },
    ],
  },

  // ── Exp 5: Exception Handling ─────────────────────────────────────────────────
  {
    _id: new ObjectId("685b2a1f3c4e8d0012a7b605"),
    subjectId: new ObjectId("685b2a1f3c4e8d0012a7b003"),
    experimentNumber: 5,
    subExperiments: [
      {
        part: "a",
        title: "Basic Exception Handling",
        concepts: ["Try-Except Blocks", "Error Catching", "Input Validation"],
        hints: [
          "Wrap dangerous operations (like division or user input conversions) in a try block.",
          "Catch specific exceptions like ZeroDivisionError or ValueError to prevent script crashes.",
          "Use an except block to display a user-friendly error message when something goes wrong.",
        ],
        problemStatement:
          "Write a Python program that takes two numbers as input and performs division. Implement exception handling to manage division by zero and invalid input errors gracefully.",
        theory:
          "Python try-except blocks handle exceptions. ZeroDivisionError is raised on division by zero; ValueError on invalid type conversion. The finally block always executes. The else block runs only if no exception occurred. Exception handling makes programs robust.",
        algorithm:
          "1. Try:\n   a. Read a, b; compute a/b; print result\n2. Except ZeroDivisionError: print error\n3. Except ValueError: print invalid input\n4. Finally: print program ended",
        flowchart: {
          nodes: [
            { id: "1", type: "start", label: "Start" },
            { id: "2", type: "input", label: "Read a, b (in try block)" },
            { id: "3", type: "process", label: "result = a / b" },
            { id: "4", type: "decision", label: "Exception?" },
            { id: "5", type: "output", label: "Print result" },
            { id: "6", type: "output", label: "Print error message" },
            { id: "7", type: "process", label: "finally: print done" },
            { id: "8", type: "end", label: "Stop" },
          ],
          edges: [
            { source: "1", target: "2" },
            { source: "2", target: "3" },
            { source: "3", target: "4" },
            { source: "4", target: "5", label: "No" },
            { source: "4", target: "6", label: "Yes" },
            { source: "5", target: "7" },
            { source: "6", target: "7" },
            { source: "7", target: "8" },
          ],
        },
        starterCode: {
          supportedLanguages: ["python"],
          templates: {
            python:
              "def safe_divide(a, b):\n    # Write your code here: handle ZeroDivisionError\n    pass\n\nif __name__ == '__main__':\n    try:\n        a = float(input('Numerator: '))\n        b = float(input('Denominator: '))\n        print(f'Result: {safe_divide(a, b)}')\n    except ValueError:\n        print('Invalid input: enter numeric values')\n    finally:\n        print('Program ended.')",
          },
        },
        samples: [
          { input: "10\n2", output: "Result: 5.0\nProgram ended.\n" },
          {
            input: "10\n0",
            output: "Error: Cannot divide by zero\nProgram ended.\n",
          },
        ],
      },
      {
        part: "b",
        title: "Custom Exceptions",
        concepts: [
          "Object-Oriented Programming",
          "Inheritance",
          "Exception Handling",
        ],
        hints: [
          "Define custom exception classes by inheriting from Python's built-in Exception class.",
          "Use the 'raise' keyword to trigger your custom exception when specific validation rules fail.",
          "Include descriptive error messages when raising the exception so users understand the issue.",
        ],
        problemStatement:
          "Develop a Python program that simulates a banking system with a function to withdraw money. Raise custom exceptions for scenarios such as insufficient funds and invalid account numbers.",
        theory:
          "Custom exceptions subclass Exception with a meaningful name. raise triggers them. They allow domain-specific error signaling and let callers handle specific error types separately, improving code readability.",
        algorithm:
          "1. Define InsufficientFundsError(Exception)\n2. Define InvalidAccountError(Exception)\n3. BankAccount.withdraw(amount):\n   a. If invalid account: raise InvalidAccountError\n   b. If amount > balance: raise InsufficientFundsError\n   c. Else: deduct amount\n4. Catch exceptions in try-except",
        flowchart: {
          nodes: [
            { id: "1", type: "start", label: "Start" },
            { id: "2", type: "process", label: "Define custom exceptions" },
            { id: "3", type: "input", label: "Read amount" },
            { id: "4", type: "decision", label: "amount <= balance?" },
            { id: "5", type: "process", label: "Deduct amount" },
            { id: "6", type: "process", label: "Raise InsufficientFundsError" },
            { id: "7", type: "output", label: "Print result or error" },
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
          supportedLanguages: ["python"],
          templates: {
            python:
              "class InsufficientFundsError(Exception): pass\nclass InvalidAccountError(Exception):   pass\n\nclass BankAccount:\n    def __init__(self, account_no, balance):\n        self.account_no = account_no\n        self.balance    = balance\n\n    def withdraw(self, amount):\n        # Write your code here\n        # Raise custom exceptions where appropriate\n        pass\n\nif __name__ == '__main__':\n    account = BankAccount('ACC001', 5000)\n    try:\n        amount = float(input('Withdrawal amount: '))\n        account.withdraw(amount)\n        print(f'Success. Balance: {account.balance}')\n    except InsufficientFundsError as e: print(f'Error: {e}')\n    except InvalidAccountError  as e: print(f'Error: {e}')",
          },
        },
        samples: [
          { input: "2000", output: "Success. Balance: 3000.0\n" },
          {
            input: "7000",
            output: "Error: Insufficient funds. Available: 5000\n",
          },
        ],
      },
      {
        part: "c",
        title: "Logging for Debugging",
        concepts: ["Standard logging Module", "Log Levels", "File Logging"],
        hints: [
          "Import the logging module and configure it using logging.basicConfig().",
          "Set appropriate logging levels like DEBUG, INFO, WARNING, ERROR, and CRITICAL.",
          "Redirect logs to a file using the filename argument in basicConfig to preserve debugging history.",
        ],
        problemStatement:
          "Enhance a Python program by adding logging statements to record the flow of execution and error messages. Use the logging module to configure different logging levels (INFO, DEBUG, ERROR).",
        theory:
          "Python's logging module provides a flexible framework. Levels: DEBUG < INFO < WARNING < ERROR < CRITICAL. logging.basicConfig() configures format and level. Handlers direct output to console or files. Preferred over print() in production code.",
        algorithm:
          "1. Import logging; configure basicConfig with level=DEBUG\n2. Create logger = logging.getLogger(__name__)\n3. Use logger.debug(), info(), warning(), error() at appropriate points\n4. Demonstrate in a real function (e.g., safe divide)",
        flowchart: {
          nodes: [
            { id: "1", type: "start", label: "Start" },
            {
              id: "2",
              type: "process",
              label: "Configure logging (basicConfig)",
            },
            {
              id: "3",
              type: "process",
              label: "Run program with logging statements",
            },
            {
              id: "4",
              type: "output",
              label: "Log messages at appropriate levels",
            },
            { id: "5", type: "end", label: "Stop" },
          ],
          edges: [
            { source: "1", target: "2" },
            { source: "2", target: "3" },
            { source: "3", target: "4" },
            { source: "4", target: "5" },
          ],
        },
        starterCode: {
          supportedLanguages: ["python"],
          templates: {
            python:
              "import logging\n\n# Write your code here: configure basicConfig\n# logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')\nlogger = logging.getLogger(__name__)\n\ndef divide(a, b):\n    logger.debug(f'divide called: a={a}, b={b}')\n    # Write your code here: log INFO before division; log ERROR on exception\n    pass\n\nif __name__ == '__main__':\n    logger.info('Program started')\n    divide(10, 2)\n    divide(10, 0)\n    logger.info('Program ended')",
          },
        },
        samples: [
          {
            input: "",
            output:
              "INFO - Program started\nDEBUG - divide called: a=10, b=2\nINFO - Result: 5.0\nDEBUG - divide called: a=10, b=0\nERROR - Division by zero\nINFO - Program ended\n",
          },
        ],
      },
      {
        part: "d",
        title: "Using a Debugger",
        concepts: ["Pdb Module", "Breakpoints", "Interactive Debugging"],
        hints: [
          "Import the pdb module and insert 'pdb.set_trace()' to pause code execution at a specific line.",
          "Use commands like 'n' (next line), 's' (step into), and 'c' (continue execution) inside the debugger.",
          "Print variable values directly in the debugger prompt to inspect the application state.",
        ],
        problemStatement:
          "Demonstrate the use of a Python debugger (e.g., pdb or an IDE with debugging capabilities) on a sample program with intentional errors. Guide students on setting breakpoints, stepping through code, and examining variable values.",
        theory:
          "Python's pdb (built-in debugger) is activated with import pdb; pdb.set_trace(). Key commands: n (next line), s (step into), c (continue), p var (print variable), l (list code), q (quit). Modern IDEs provide graphical debugging. Debuggers are essential for identifying logic errors.",
        algorithm:
          "1. Write a program with an intentional bug\n2. Insert pdb.set_trace() as a breakpoint\n3. Run; use n/s to step through\n4. Use p var to inspect values\n5. Identify and fix the bug",
        flowchart: {
          nodes: [
            { id: "1", type: "start", label: "Start" },
            { id: "2", type: "process", label: "Write buggy program" },
            { id: "3", type: "process", label: "Insert pdb.set_trace()" },
            {
              id: "4",
              type: "process",
              label: "Step through with n/s/p commands",
            },
            { id: "5", type: "decision", label: "Bug found?" },
            { id: "6", type: "process", label: "Fix bug; re-run" },
            { id: "7", type: "output", label: "Program runs correctly" },
            { id: "8", type: "end", label: "Stop" },
          ],
          edges: [
            { source: "1", target: "2" },
            { source: "2", target: "3" },
            { source: "3", target: "4" },
            { source: "4", target: "5" },
            { source: "5", target: "6", label: "Yes" },
            { source: "5", target: "4", label: "No" },
            { source: "6", target: "7" },
            { source: "7", target: "8" },
          ],
        },
        starterCode: {
          supportedLanguages: ["python"],
          templates: {
            python:
              "# Debugging demonstration — find and fix the bug below\n\ndef calculate_average(numbers):\n    total = 0\n    for num in numbers:\n        total += num\n    # Bug: divides by len-1 instead of len\n    average = total / (len(numbers) - 1)  # intentional bug\n    return average\n\nif __name__ == '__main__':\n    # Uncomment to use debugger:\n    # import pdb; pdb.set_trace()\n    numbers = [10, 20, 30, 40, 50]\n    print(f'Average: {calculate_average(numbers)}')  # Expected: 30.0",
          },
        },
        samples: [{ input: "", output: "Average: 30.0\n" }],
      },
      {
        part: "e",
        title: "Scientific Debugging Techniques",
        concepts: [
          "Debugging Methodologies",
          "Hypothesis Testing",
          "Assert Statements",
        ],
        hints: [
          "Formulate a hypothesis about the bug and use print/logs to confirm or reject it.",
          "Use python's 'assert' statements to enforce invariants and catch logic errors early.",
          "Isolate the buggy code by writing minimal test cases with expected inputs and outputs.",
        ],
        problemStatement:
          "Provide a Python program with multiple logic and runtime errors. Instruct students to apply scientific debugging techniques, such as binary search debugging, to identify and resolve the issues methodically.",
        theory:
          "Scientific debugging treats finding bugs as hypothesis testing. Binary search debugging: insert print/assert at the midpoint; if correct there, bug is in the second half. assert statements verify invariants. Systematic approaches are faster than random trial-and-error.",
        algorithm:
          "1. Observe wrong output\n2. Hypothesize which section causes the error\n3. Add assert/print at midpoint\n4. If midpoint correct: bug in 2nd half; else in 1st half\n5. Repeat until isolated\n6. Fix and verify",
        flowchart: {
          nodes: [
            { id: "1", type: "start", label: "Start" },
            { id: "2", type: "process", label: "Observe wrong output" },
            { id: "3", type: "process", label: "Add assert/print at midpoint" },
            { id: "4", type: "decision", label: "Midpoint correct?" },
            { id: "5", type: "process", label: "Bug in 2nd half" },
            { id: "6", type: "process", label: "Bug in 1st half" },
            { id: "7", type: "decision", label: "Bug isolated?" },
            { id: "8", type: "process", label: "Fix and verify" },
            { id: "9", type: "end", label: "Stop" },
          ],
          edges: [
            { source: "1", target: "2" },
            { source: "2", target: "3" },
            { source: "3", target: "4" },
            { source: "4", target: "5", label: "Yes" },
            { source: "4", target: "6", label: "No" },
            { source: "5", target: "7" },
            { source: "6", target: "7" },
            { source: "7", target: "3", label: "No" },
            { source: "7", target: "8", label: "Yes" },
            { source: "8", target: "9" },
          ],
        },
        starterCode: {
          supportedLanguages: ["python"],
          templates: {
            python:
              "# Program with multiple bugs — apply scientific debugging\n\ndef bubble_sort(arr):\n    n = len(arr)\n    for i in range(n):\n        for j in range(0, n-i):      # Bug 1: should be n-i-1\n            if arr[j] > arr[j+1]:    # Bug 2: index error from Bug 1\n                arr[j], arr[j+1] = arr[j+1], arr[j]\n    return arr\n\ndef find_max(arr):\n    max_val = arr[0]\n    for i in range(len(arr)):\n        if arr[i] > max_val:\n            max_val == arr[i]        # Bug 3: == should be =\n    return max_val\n\nif __name__ == '__main__':\n    data = [64, 34, 25, 12, 22, 11, 90]\n    print('Sorted:', bubble_sort(data[:]))\n    print('Max:',    find_max(data))",
          },
        },
        samples: [
          {
            input: "",
            output: "Sorted: [11, 12, 22, 25, 34, 64, 90]\nMax: 90\n",
          },
        ],
      },
    ],
  },

  // ── Exp 6: OOP ────────────────────────────────────────────────────────────────
  {
    _id: new ObjectId("685b2a1f3c4e8d0012a7b606"),
    subjectId: new ObjectId("685b2a1f3c4e8d0012a7b003"),
    experimentNumber: 6,
    subExperiments: [
      {
        part: "a",
        title: "Event Management System",
        concepts: [
          "Object-Oriented Programming",
          "Classes and Objects",
          "List Attributes",
        ],
        hints: [
          "Create an Event class with attributes like name, date, and attendee_list.",
          "Implement methods within the class to add attendees, remove attendees, and display event details.",
          "Instantiate multiple event objects to represent different schedules.",
        ],
        problemStatement:
          "Implement an event management system using OOP concepts (encapsulation, inheritance, polymorphism) to manage college festivals or events. Design classes for events, organizers, participants, and activities, including methods for event registration, scheduling, participant management, and activity coordination.",
        theory:
          "Python OOP: class defines objects; __init__ is the constructor; super() calls parent. Encapsulation hides state with _prefix. Inheritance: class Child(Parent). Polymorphism: overriding display() in subclasses. __str__ provides string representation.",
        algorithm:
          "1. Define Event class (name, date, venue, participants list)\n2. Define CulturalEvent(Event) and TechnicalEvent(Event) with overridden display()\n3. Define Participant with register(event) method\n4. Demonstrate: create events, register participants, display schedule",
        flowchart: {
          nodes: [
            { id: "1", type: "start", label: "Start" },
            {
              id: "2",
              type: "process",
              label: "Define Event, Organizer, Participant classes",
            },
            {
              id: "3",
              type: "process",
              label: "Create event objects and organizer",
            },
            { id: "4", type: "process", label: "Register participants" },
            { id: "5", type: "output", label: "Display event schedule" },
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
          supportedLanguages: ["python"],
          templates: {
            python:
              "class Event:\n    def __init__(self, name, date, venue):\n        # Write your code here\n        pass\n    def display(self):\n        # Write your code here\n        pass\n\nclass CulturalEvent(Event):\n    def __init__(self, name, date, venue, theme):\n        super().__init__(name, date, venue)\n        self.theme = theme\n    def display(self):\n        # Write your code here (override)\n        pass\n\nclass Participant:\n    def __init__(self, name, roll_no):\n        self.name, self.roll_no = name, roll_no\n    def register(self, event):\n        # Write your code here\n        pass\n\nif __name__ == '__main__':\n    e1 = CulturalEvent('Techfest 2024', '2024-03-15', 'Auditorium', 'Innovation')\n    p1 = Participant('Alice', 'CS101')\n    p1.register(e1)\n    e1.display()",
          },
        },
        samples: [
          {
            input: "",
            output:
              "Event: Techfest 2024 | Date: 2024-03-15 | Venue: Auditorium | Theme: Innovation\nAlice (CS101) registered for Techfest 2024\n",
          },
        ],
      },
      {
        part: "b",
        title: "Online Shopping System",
        concepts: [
          "Object-Oriented Programming",
          "Class Associations",
          "Logic Methods",
        ],
        hints: [
          "Define classes like Product, Cart, and Customer to represent actors in the shopping system.",
          "The Cart class should contain a list of Product objects and methods to calculate the total price.",
          "Enable customers to add items to their cart, update quantities, and checkout.",
        ],
        problemStatement:
          "Develop an online shopping system using OOP principles. Create classes for products, customers, and shopping carts, with methods for adding items to the cart, calculating total costs, processing orders, and managing inventory.",
        theory:
          "Multiple interacting classes: Product (price, stock), ShoppingCart (list of items), Customer (name, cart). Composition: Customer has-a ShoppingCart. __len__ and __str__ customize object behavior. List comprehensions and sum() simplify total calculation.",
        algorithm:
          "1. Define Product(name, price, stock)\n2. Define ShoppingCart: add_item(), remove_item(), calculate_total()\n3. Define Customer(name): has cart attribute\n4. Demonstrate: create products, add to cart, display and checkout",
        flowchart: {
          nodes: [
            { id: "1", type: "start", label: "Start" },
            { id: "2", type: "process", label: "Create Product objects" },
            {
              id: "3",
              type: "process",
              label: "Customer adds items to ShoppingCart",
            },
            { id: "4", type: "process", label: "Calculate total cost" },
            { id: "5", type: "output", label: "Print receipt" },
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
          supportedLanguages: ["python"],
          templates: {
            python:
              "class Product:\n    def __init__(self, name, price, stock):\n        # Write your code here\n        pass\n\nclass ShoppingCart:\n    def __init__(self): self.items = []\n    def add_item(self, product, qty=1):\n        # Write your code here\n        pass\n    def calculate_total(self):\n        # Write your code here\n        pass\n    def display(self):\n        # Write your code here\n        pass\n\nclass Customer:\n    def __init__(self, name): self.name = name; self.cart = ShoppingCart()\n\nif __name__ == '__main__':\n    p1 = Product('Laptop', 45000, 10)\n    p2 = Product('Mouse', 500, 50)\n    c = Customer('Alice')\n    c.cart.add_item(p1)\n    c.cart.add_item(p2, 2)\n    c.cart.display()\n    print(f'Total: Rs. {c.cart.calculate_total()}')",
          },
        },
        samples: [
          {
            input: "",
            output:
              "Laptop x1 = Rs. 45000\nMouse x2 = Rs. 1000\nTotal: Rs. 46000\n",
          },
        ],
      },
      {
        part: "c",
        title: "Vehicle Rental System",
        concepts: ["OOP Inheritance", "Polymorphism", "Abstract Base Classes"],
        hints: [
          "Create a parent Vehicle class and inherit from it to build Car, Bike, and Truck subclasses.",
          "Override common methods (like calculate_rental_cost) in subclass definitions for specialized logic.",
          "Use constructor delegation (super().__init__) to pass common attributes to the parent class.",
        ],
        problemStatement:
          "Design a vehicle rental system using OOP principles with classes for vehicles, rental agencies, and rental transactions. Implement methods to handle vehicle availability, rental periods, pricing, and customer bookings.",
        theory:
          "Inheritance: Car(Vehicle), Bike(Vehicle) with different daily rates. Encapsulation: _is_available attribute with getter/setter. Composition: RentalAgency has-a list of Vehicles. RentalTransaction records bookings. datetime calculates rental duration.",
        algorithm:
          "1. Define Vehicle(id, model, daily_rate) with rent() and return_vehicle()\n2. Define Car(Vehicle) and Bike(Vehicle)\n3. Define RentalAgency: add_vehicle(), rent_vehicle(id, customer, days)\n4. Demonstrate: rent and return vehicles, print total cost",
        flowchart: {
          nodes: [
            { id: "1", type: "start", label: "Start" },
            { id: "2", type: "process", label: "Create vehicles in agency" },
            { id: "3", type: "input", label: "Customer requests vehicle" },
            { id: "4", type: "decision", label: "Vehicle available?" },
            {
              id: "5",
              type: "process",
              label: "Create rental; mark unavailable",
            },
            { id: "6", type: "output", label: "Rental confirmed + cost" },
            { id: "7", type: "output", label: "Not available" },
            { id: "8", type: "end", label: "Stop" },
          ],
          edges: [
            { source: "1", target: "2" },
            { source: "2", target: "3" },
            { source: "3", target: "4" },
            { source: "4", target: "5", label: "Yes" },
            { source: "4", target: "7", label: "No" },
            { source: "5", target: "6" },
            { source: "6", target: "8" },
            { source: "7", target: "8" },
          ],
        },
        starterCode: {
          supportedLanguages: ["python"],
          templates: {
            python:
              "class Vehicle:\n    def __init__(self, vid, model, daily_rate):\n        self.vid, self.model, self.daily_rate = vid, model, daily_rate\n        self._is_available = True\n    def rent(self):           self._is_available = False\n    def return_vehicle(self): self._is_available = True\n\nclass Car(Vehicle):\n    def __init__(self, vid, model, daily_rate, seats):\n        super().__init__(vid, model, daily_rate)\n        self.seats = seats\n\nclass RentalAgency:\n    def __init__(self, name): self.name = name; self.fleet = []\n    def add_vehicle(self, v): self.fleet.append(v)\n    def rent_vehicle(self, vid, customer, days):\n        # Write your code here\n        # Find vehicle by vid, check availability, calculate cost\n        pass\n\nif __name__ == '__main__':\n    agency = RentalAgency('SpeedyRentals')\n    car1 = Car('C001', 'Toyota Innova', 1500, 7)\n    agency.add_vehicle(car1)\n    agency.rent_vehicle('C001', 'Bob', 3)",
          },
        },
        samples: [
          {
            input: "",
            output:
              "C001 (Toyota Innova) rented to Bob for 3 days.\nTotal cost: Rs. 4500\n",
          },
        ],
      },
    ],
  },

  // ── Exp 7: GUI ────────────────────────────────────────────────────────────────
  {
    _id: new ObjectId("685b2a1f3c4e8d0012a7b607"),
    subjectId: new ObjectId("685b2a1f3c4e8d0012a7b003"),
    experimentNumber: 7,
    subExperiments: [
      {
        part: "a",
        title: "GUI for Developing Conversion Utilities",
        concepts: ["Tkinter Library", "GUI Components", "Event Handling"],
        hints: [
          "Import tkinter (or tkinter.ttk) to build windows, input fields (Entry), and labels.",
          "Define callback functions to process input when the user clicks the convert Button.",
          "Use grid() or pack() geometry managers to place buttons and inputs neatly on the screen.",
        ],
        problemStatement:
          "Develop a Python GUI application that performs various unit conversions such as currency (Rupees to Dollars), temperature (Celsius to Fahrenheit), and length (Inches to Feet). Include input fields, dropdown menus or buttons for selection, and labels to display results.",
        theory:
          "Python's tkinter library provides GUI capabilities. tk.Tk() creates the main window. Widgets: Label, Entry, Button, OptionMenu. Layouts: pack(), grid(). StringVar tracks dropdown values. Command callbacks link buttons to functions. Event-driven programming: code runs in response to user actions.",
        algorithm:
          "1. Create Tk window\n2. Add Entry for value, OptionMenu for conversion type\n3. Add Convert button linked to convert() callback\n4. In convert(): read input, apply formula, update result Label\n5. mainloop()",
        flowchart: {
          nodes: [
            { id: "1", type: "start", label: "Start" },
            { id: "2", type: "process", label: "Create Tk window and widgets" },
            { id: "3", type: "process", label: "mainloop() — wait for events" },
            { id: "4", type: "input", label: "User clicks Convert" },
            { id: "5", type: "process", label: "Read input; apply formula" },
            { id: "6", type: "output", label: "Update result Label" },
            { id: "7", type: "end", label: "Stop" },
          ],
          edges: [
            { source: "1", target: "2" },
            { source: "2", target: "3" },
            { source: "3", target: "4" },
            { source: "4", target: "5" },
            { source: "5", target: "6" },
            { source: "6", target: "3" },
          ],
        },
        starterCode: {
          supportedLanguages: ["python"],
          templates: {
            python:
              "import tkinter as tk\nfrom tkinter import ttk, messagebox\n\ndef convert():\n    # Write your code here\n    # Read entry value and conversion_var, apply formula, update result_label\n    pass\n\nroot = tk.Tk()\nroot.title('Unit Converter')\nroot.geometry('400x250')\n\ntk.Label(root, text='Enter Value:').grid(row=0, column=0, padx=10, pady=10)\nentry = tk.Entry(root)\nentry.grid(row=0, column=1, padx=10)\n\nconversion_var = tk.StringVar(value='Rupees to Dollars')\nttk.OptionMenu(root, conversion_var, 'Rupees to Dollars',\n               'Rupees to Dollars', 'Celsius to Fahrenheit', 'Inches to Feet'\n).grid(row=1, column=0, columnspan=2, pady=5)\n\ntk.Button(root, text='Convert', command=convert).grid(row=2, column=0, columnspan=2, pady=10)\nresult_label = tk.Label(root, text='Result: ', font=('Arial', 12))\nresult_label.grid(row=3, column=0, columnspan=2)\n\nroot.mainloop()",
          },
        },
        samples: [
          { input: "", output: "(GUI Application — no console output)\n" },
        ],
      },
      {
        part: "b",
        title: "GUI for Calculating Areas of Geometric Figures",
        concepts: ["Tkinter Geometry", "Event Bindings", "Dynamic UI Elements"],
        hints: [
          "Create a window that allows users to select a shape using options like dropdown menus or radio buttons.",
          "Dynamically display input entry boxes depending on the selected shape (e.g. radius for circle, length/width for rectangle).",
          "Read input values, perform calculations, and display the calculated area in a label widget.",
        ],
        problemStatement:
          "Develop a Python GUI application to calculate areas of geometric figures such as circles, rectangles, and triangles. Include input fields for dimensions, buttons to trigger calculations, and labels to display the results.",
        theory:
          "ttk.Notebook creates tabbed interfaces for organizing related widgets. try-except in callbacks validates user input. messagebox shows error dialogs. grid(sticky='ew') makes widgets expand. Fonts are set with the font parameter.",
        algorithm:
          "1. Create Notebook with tabs: Circle, Rectangle, Triangle\n2. Each tab: Entry widgets for dimensions, Calculate button, Result label\n3. Calculate button calls the area formula and updates result label\n4. mainloop()",
        flowchart: {
          nodes: [
            { id: "1", type: "start", label: "Start" },
            { id: "2", type: "process", label: "Create tabbed Notebook GUI" },
            { id: "3", type: "process", label: "mainloop()" },
            {
              id: "4",
              type: "input",
              label: "User enters dims and clicks Calculate",
            },
            { id: "5", type: "process", label: "Compute area" },
            { id: "6", type: "output", label: "Update result label" },
            { id: "7", type: "end", label: "Stop" },
          ],
          edges: [
            { source: "1", target: "2" },
            { source: "2", target: "3" },
            { source: "3", target: "4" },
            { source: "4", target: "5" },
            { source: "5", target: "6" },
            { source: "6", target: "3" },
          ],
        },
        starterCode: {
          supportedLanguages: ["python"],
          templates: {
            python:
              "import tkinter as tk\nfrom tkinter import ttk, messagebox\nimport math\n\ndef calc_circle():\n    try:\n        r = float(radius_entry.get())\n        circle_result.config(text=f'Area = {math.pi*r*r:.2f}')\n    except ValueError:\n        messagebox.showerror('Error', 'Enter a valid radius')\n\n# Write your code here: calc_rectangle() and calc_triangle() similarly\n\nroot = tk.Tk()\nroot.title('Area Calculator')\nnb = ttk.Notebook(root)\nnb.pack(fill='both', expand=True, padx=10, pady=10)\n\ncf = ttk.Frame(nb); nb.add(cf, text='Circle')\ntk.Label(cf, text='Radius:').grid(row=0, column=0, padx=10, pady=10)\nradius_entry = tk.Entry(cf); radius_entry.grid(row=0, column=1)\ntk.Button(cf, text='Calculate', command=calc_circle).grid(row=1, columnspan=2)\ncircle_result = tk.Label(cf, text='Area = ')\ncircle_result.grid(row=2, columnspan=2)\n\n# Add Rectangle and Triangle frames similarly\nroot.mainloop()",
          },
        },
        samples: [
          { input: "", output: "(GUI Application — no console output)\n" },
        ],
      },
      {
        part: "c",
        title: "College Admission Registration Form",
        concepts: ["Tkinter Forms", "Input Validation", "Data Storage"],
        hints: [
          "Use various Tkinter widgets: Entry (for text), Radiobuttons (for gender), and Checkbuttons (for courses).",
          "Implement validation to verify that required fields are filled before submitting the form.",
          "Write the submitted registration data to a text or CSV file for persistent storage.",
        ],
        problemStatement:
          "Create a GUI application for a college admission registration form that collects personal, educational, and contact information. The interface should include text fields for names, radio buttons for branch selection, checkboxes for favorite games, and a submit button that displays a formatted output message based on user inputs.",
        theory:
          "tkinter input widgets: Entry (text), Radiobutton (single choice with StringVar), Checkbutton (multiple choice with BooleanVar). Submit callback reads all widget variables and formats a summary using messagebox. Reset clears all fields. This demonstrates a complete form-based GUI application.",
        algorithm:
          "1. Create form: name Entry, branch Radiobuttons, games Checkbuttons, email Entry\n2. Add Submit button\n3. In submit(): validate fields, format and display summary in messagebox\n4. Add Reset button to clear all fields\n5. mainloop()",
        flowchart: {
          nodes: [
            { id: "1", type: "start", label: "Start" },
            { id: "2", type: "process", label: "Create form widgets" },
            { id: "3", type: "process", label: "mainloop()" },
            { id: "4", type: "input", label: "User fills form, clicks Submit" },
            { id: "5", type: "decision", label: "All fields valid?" },
            { id: "6", type: "output", label: "Show registration summary" },
            { id: "7", type: "output", label: "Show validation error" },
            { id: "8", type: "end", label: "Stop" },
          ],
          edges: [
            { source: "1", target: "2" },
            { source: "2", target: "3" },
            { source: "3", target: "4" },
            { source: "4", target: "5" },
            { source: "5", target: "6", label: "Yes" },
            { source: "5", target: "7", label: "No" },
            { source: "6", target: "3" },
            { source: "7", target: "3" },
          ],
        },
        starterCode: {
          supportedLanguages: ["python"],
          templates: {
            python:
              "import tkinter as tk\nfrom tkinter import messagebox\n\nroot = tk.Tk()\nroot.title('College Admission Form')\nroot.geometry('500x450')\n\ntk.Label(root, text='Full Name:').grid(row=0, column=0, sticky='w', padx=10, pady=5)\nname_entry = tk.Entry(root, width=30)\nname_entry.grid(row=0, column=1, padx=10)\n\nbranch_var = tk.StringVar(value='CS')\nfor i, (label, val) in enumerate([('Computer Science','CS'),('Electronics','EC'),('Mechanical','ME')]):\n    tk.Radiobutton(root, text=label, variable=branch_var, value=val).grid(row=1+i, column=1, sticky='w')\n\ngames_vars = {g: tk.BooleanVar() for g in ['Cricket','Football','Chess']}\nfor i, (g, v) in enumerate(games_vars.items()):\n    tk.Checkbutton(root, text=g, variable=v).grid(row=4+i, column=1, sticky='w')\n\ndef submit():\n    # Write your code here: validate and display formatted summary\n    pass\n\ntk.Button(root, text='Submit', command=submit, bg='green', fg='white').grid(row=8, columnspan=2, pady=15)\nroot.mainloop()",
          },
        },
        samples: [
          { input: "", output: "(GUI Application — no console output)\n" },
        ],
      },
    ],
  },

  // ── Exp 8: Regular Expressions ────────────────────────────────────────────────
  {
    _id: new ObjectId("685b2a1f3c4e8d0012a7b608"),
    subjectId: new ObjectId("685b2a1f3c4e8d0012a7b003"),
    experimentNumber: 8,
    subExperiments: [
      {
        part: "a",
        title: "Script to Validate Phone Number and Email ID",
        concepts: ["Regular Expressions", "re Module", "Pattern Matching"],
        hints: [
          "Import the re module and use re.match() or re.fullmatch() for pattern validation.",
          "Use the email regex pattern: r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'.",
          "Use the phone regex pattern for 10-digit validation: r'^[6-9]\d{9}$'.",
        ],
        problemStatement:
          "Write a Python script that prompts the user to enter their phone number and email ID, employing regular expressions to verify if these inputs adhere to standard formats.",
        theory:
          "Python's re module provides re.fullmatch() to match entire string against a pattern. Phone (Indian): ^[6-9]\\d{9}$. Email: ^[\\w.%+-]+@[\\w.-]+\\.[a-zA-Z]{2,}$. Patterns use: ^ (start), $ (end), \\d (digit), + (one or more), {n} (exactly n times).",
        algorithm:
          "1. Define phone_pattern and email_pattern\n2. Read phone and email from user\n3. If re.fullmatch(phone_pattern, phone): valid\n4. If re.fullmatch(email_pattern, email): valid\n5. Print results",
        flowchart: {
          nodes: [
            { id: "1", type: "start", label: "Start" },
            { id: "2", type: "input", label: "Read phone, email" },
            { id: "3", type: "decision", label: "Phone matches pattern?" },
            { id: "4", type: "output", label: "Valid phone" },
            { id: "5", type: "output", label: "Invalid phone" },
            { id: "6", type: "decision", label: "Email matches pattern?" },
            { id: "7", type: "output", label: "Valid email" },
            { id: "8", type: "output", label: "Invalid email" },
            { id: "9", type: "end", label: "Stop" },
          ],
          edges: [
            { source: "1", target: "2" },
            { source: "2", target: "3" },
            { source: "3", target: "4", label: "Yes" },
            { source: "3", target: "5", label: "No" },
            { source: "4", target: "6" },
            { source: "5", target: "6" },
            { source: "6", target: "7", label: "Yes" },
            { source: "6", target: "8", label: "No" },
            { source: "7", target: "9" },
            { source: "8", target: "9" },
          ],
        },
        starterCode: {
          supportedLanguages: ["python"],
          templates: {
            python:
              "import re\n\nphone_pattern = r'^[6-9]\\d{9}$'\nemail_pattern = r'^[\\w.%+-]+@[\\w.-]+\\.[a-zA-Z]{2,}$'\n\ndef validate_phone(phone): return bool(re.fullmatch(phone_pattern, phone))\ndef validate_email(email): return bool(re.fullmatch(email_pattern, email))\n\nif __name__ == '__main__':\n    phone = input('Enter phone number: ')\n    email = input('Enter email ID: ')\n    print(f'Phone: {\"Valid\" if validate_phone(phone) else \"Invalid\"}')\n    print(f'Email: {\"Valid\" if validate_email(email) else \"Invalid\"}')",
          },
        },
        samples: [
          {
            input: "9876543210\nalice@example.com",
            output: "Phone: Valid\nEmail: Valid\n",
          },
          {
            input: "12345\nalice@invalid",
            output: "Phone: Invalid\nEmail: Invalid\n",
          },
        ],
      },
      {
        part: "b",
        title: "Password Strength Checker",
        concepts: ["Regular Expressions", "String Analysis", "Logic Checks"],
        hints: [
          "Check password length first (e.g., minimum 8 characters).",
          "Use regular expressions to verify the presence of uppercase, lowercase, numbers, and special symbols.",
          "Assign strength levels (Weak, Medium, Strong) based on how many criteria the password meets.",
        ],
        problemStatement:
          "Write a Python script that prompts the user to enter a password and uses regular expressions to validate it based on criteria: at least 8 characters long, contains at least one uppercase letter, one lowercase letter, one digit, and one special character.",
        theory:
          "Multiple re.search() calls each check one criterion independently. Lookahead assertions (?=.*[A-Z]) can combine all criteria in a single regex. Score-based strength: 5/5=Strong, 3-4=Medium, <3=Weak. Password feedback improves user experience.",
        algorithm:
          "1. Read password\n2. Check: len>=8, [A-Z], [a-z], [0-9], [!@#$%^&*]\n3. Count passing criteria (score)\n4. If score==5: Strong; elif score>=3: Medium; else: Weak\n5. Print analysis and strength",
        flowchart: {
          nodes: [
            { id: "1", type: "start", label: "Start" },
            { id: "2", type: "input", label: "Read password" },
            {
              id: "3",
              type: "process",
              label: "Check each criterion; score++",
            },
            { id: "4", type: "decision", label: "score == 5?" },
            { id: "5", type: "output", label: "Strong" },
            { id: "6", type: "decision", label: "score >= 3?" },
            { id: "7", type: "output", label: "Medium" },
            { id: "8", type: "output", label: "Weak" },
            { id: "9", type: "end", label: "Stop" },
          ],
          edges: [
            { source: "1", target: "2" },
            { source: "2", target: "3" },
            { source: "3", target: "4" },
            { source: "4", target: "5", label: "Yes" },
            { source: "4", target: "6", label: "No" },
            { source: "5", target: "9" },
            { source: "6", target: "7", label: "Yes" },
            { source: "6", target: "8", label: "No" },
            { source: "7", target: "9" },
            { source: "8", target: "9" },
          ],
        },
        starterCode: {
          supportedLanguages: ["python"],
          templates: {
            python:
              "import re\n\ndef check_password_strength(password):\n    criteria = {\n        'Length >= 8':        len(password) >= 8,\n        'Uppercase letter':   bool(re.search(r'[A-Z]', password)),\n        'Lowercase letter':   bool(re.search(r'[a-z]', password)),\n        'Digit':              bool(re.search(r'\\d',    password)),\n        # Write your code here: Special character check\n    }\n    score = sum(criteria.values())\n    for crit, ok in criteria.items():\n        print(f'  {crit}: {\"Pass\" if ok else \"Fail\"}')\n    # Write your code here: return 'Strong', 'Medium', or 'Weak'\n    pass\n\nif __name__ == '__main__':\n    pwd = input('Enter password: ')\n    print('Password Analysis:')\n    strength = check_password_strength(pwd)\n    print(f'Strength: {strength}')",
          },
        },
        samples: [
          {
            input: "MyPass@123",
            output:
              "Password Analysis:\n  Length >= 8: Pass\n  Uppercase letter: Pass\n  Lowercase letter: Pass\n  Digit: Pass\n  Special character: Pass\nStrength: Strong\n",
          },
          {
            input: "hello",
            output:
              "Password Analysis:\n  Length >= 8: Fail\n  Uppercase letter: Fail\n  Lowercase letter: Pass\n  Digit: Fail\n  Special character: Fail\nStrength: Weak\n",
          },
        ],
      },
      {
        part: "c",
        title: "URL Validator",
        concepts: ["Regular Expressions", "URL Anatomy", "Pattern Validation"],
        hints: [
          "Construct a regex pattern matching URL components: protocol (http/https), domain, optional port, and path.",
          "Ensure the URL pattern allows optional components like 'www' or query parameters.",
          "Use re.match() to check if the input URL conforms to the standard URL structure.",
        ],
        problemStatement:
          "Develop a script that verifies if a given string is a valid URL using regular expressions to check for standard formats, including protocols (http, https), domain names, and optional path segments.",
        theory:
          "URL regex: ^(https?://)(([\\w-]+\\.)+[\\w]{2,})(/[\\w/._~:?#\\[\\]@!$&'()*+,;=%-]*)?$. Breaks into: protocol (http/https), domain, TLD (2+ letters), optional path. urllib.parse is an alternative. Proper URL validation prevents injection attacks.",
        algorithm:
          "1. Define URL pattern\n2. Read URL\n3. Apply re.fullmatch(url_pattern, url)\n4. Print Valid or Invalid",
        flowchart: {
          nodes: [
            { id: "1", type: "start", label: "Start" },
            { id: "2", type: "input", label: "Read URL" },
            { id: "3", type: "process", label: "Apply URL regex" },
            { id: "4", type: "decision", label: "Match?" },
            { id: "5", type: "output", label: "Valid URL" },
            { id: "6", type: "output", label: "Invalid URL" },
            { id: "7", type: "end", label: "Stop" },
          ],
          edges: [
            { source: "1", target: "2" },
            { source: "2", target: "3" },
            { source: "3", target: "4" },
            { source: "4", target: "5", label: "Yes" },
            { source: "4", target: "6", label: "No" },
            { source: "5", target: "7" },
            { source: "6", target: "7" },
          ],
        },
        starterCode: {
          supportedLanguages: ["python"],
          templates: {
            python:
              "import re\n\nurl_pattern = r'^(https?://)([\\w-]+\\.)+[\\w]{2,}(/[\\w/._~:?#\\[\\]@!$&\\'()*+,;=%-]*)?$'\n\ndef validate_url(url):\n    # Write your code here: return True if URL matches pattern\n    pass\n\nif __name__ == '__main__':\n    urls = [\n        'https://www.example.com',\n        'http://example.com/path',\n        'ftp://invalid.com',\n        'not_a_url'\n    ]\n    for url in urls:\n        print(f'{url}: {\"Valid\" if validate_url(url) else \"Invalid\"}')",
          },
        },
        samples: [
          {
            input: "",
            output:
              "https://www.example.com: Valid\nhttp://example.com/path: Valid\nftp://invalid.com: Invalid\nnot_a_url: Invalid\n",
          },
        ],
      },
      {
        part: "d",
        title: "Extracting Data from Text",
        concepts: ["Regular Expressions", "re.findall", "Pattern Extraction"],
        hints: [
          "Use re.findall() to search and extract all occurrences of a pattern (like email addresses or phone numbers) in a large text.",
          "Use regex character classes and qualifiers to capture desired text structures precisely.",
          "Iterate and print the list of extracted matches.",
        ],
        problemStatement:
          "Create a program that reads a text file containing various data (e.g., names, emails, phone numbers) and uses regular expressions to extract specific types of data, such as email addresses, phone numbers, and dates (e.g., MM/DD/YYYY format).",
        theory:
          "re.findall(pattern, text) returns all matches as a list. Common patterns: email [\\w.%+-]+@[\\w.-]+\\.[a-zA-Z]{2,}, phone [6-9]\\d{9}, date (0?[1-9]|1[0-2])/(0?[1-9]|[12]\\d|3[01])/(\\d{4}). Demonstrates practical data extraction from unstructured text.",
        algorithm:
          "1. Read text content\n2. Apply email pattern with re.findall()\n3. Apply phone pattern\n4. Apply date pattern\n5. Print all extracted data",
        flowchart: {
          nodes: [
            { id: "1", type: "start", label: "Start" },
            { id: "2", type: "input", label: "Read text" },
            {
              id: "3",
              type: "process",
              label: "re.findall() for emails, phones, dates",
            },
            { id: "4", type: "output", label: "Print extracted data" },
            { id: "5", type: "end", label: "Stop" },
          ],
          edges: [
            { source: "1", target: "2" },
            { source: "2", target: "3" },
            { source: "3", target: "4" },
            { source: "4", target: "5" },
          ],
        },
        starterCode: {
          supportedLanguages: ["python"],
          templates: {
            python:
              "import re\n\nemail_pattern = r'[\\w.%+-]+@[\\w.-]+\\.[a-zA-Z]{2,}'\nphone_pattern = r'\\b[6-9]\\d{9}\\b'\ndate_pattern  = r'\\b(0?[1-9]|1[0-2])/(0?[1-9]|[12]\\d|3[01])/(\\d{4})\\b'\n\ndef extract_data(text):\n    emails = re.findall(email_pattern, text)\n    phones = re.findall(phone_pattern, text)\n    # Write your code here: extract dates using date_pattern\n    dates = []\n    return emails, phones, dates\n\nif __name__ == '__main__':\n    text = \"\"\"\n    Contact Alice at alice@example.com or call 9876543210.\n    Bob's email is bob@college.edu, phone: 8765432109.\n    Meeting on 03/15/2024 and 12/25/2024.\n    \"\"\"\n    emails, phones, dates = extract_data(text)\n    print('Emails:', emails)\n    print('Phones:', phones)\n    print('Dates:', dates)",
          },
        },
        samples: [
          {
            input: "",
            output:
              "Emails: ['alice@example.com', 'bob@college.edu']\nPhones: ['9876543210', '8765432109']\nDates: ['03/15/2024', '12/25/2024']\n",
          },
        ],
      },
    ],
  },

  // ── Exp 9: NumPy ──────────────────────────────────────────────────────────────
  {
    _id: new ObjectId("685b2a1f3c4e8d0012a7b609"),
    subjectId: new ObjectId("685b2a1f3c4e8d0012a7b003"),
    experimentNumber: 9,
    subExperiments: [
      {
        part: "a",
        title: "Creating and Manipulating Arrays",
        concepts: ["NumPy Arrays", "Array Creation", "Vectorized Operations"],
        hints: [
          "Import numpy as np and use np.array() to convert lists into multidimensional arrays.",
          "Use helper functions like np.arange() or np.zeros() to generate initial arrays easily.",
          "Inspect array dimensions and types using properties like shape, ndim, and dtype.",
        ],
        problemStatement:
          "Write a Python program to create a 1D, 2D, and 3D NumPy array, and perform basic operations like reshaping, slicing, and indexing.",
        theory:
          "NumPy's ndarray enables efficient multi-dimensional array operations. np.array() creates arrays from lists. reshape() changes dimensions without copying. Slicing uses [start:stop:step]. Broadcasting allows operations between arrays of different shapes. NumPy operations are vectorized at C-speed.",
        algorithm:
          "1. Create 1D array: np.array([1,2,3,4,5])\n2. Create 2D array: np.array([[1,2,3],[4,5,6],[7,8,9]])\n3. Create 3D array: np.zeros((2,3,4))\n4. Reshape 1D to (5,1); slice first 3 elements\n5. Print all results",
        flowchart: {
          nodes: [
            { id: "1", type: "start", label: "Start" },
            { id: "2", type: "process", label: "Create 1D, 2D, 3D arrays" },
            { id: "3", type: "process", label: "Reshape, slice, index" },
            { id: "4", type: "output", label: "Print results" },
            { id: "5", type: "end", label: "Stop" },
          ],
          edges: [
            { source: "1", target: "2" },
            { source: "2", target: "3" },
            { source: "3", target: "4" },
            { source: "4", target: "5" },
          ],
        },
        starterCode: {
          supportedLanguages: ["python"],
          templates: {
            python:
              "import numpy as np\n\n# 1. Create 1D array of 5 elements\narr_1d = np.array([1, 2, 3, 4, 5])\n\n# 2. Create 2D array (3x3)\narr_2d = None  # Write your code here\n\n# 3. Create 3D zero array (2x3x4)\narr_3d = None  # Write your code here\n\n# 4. Reshape arr_1d to (5,1); slice first 3 elements\nreshaped = None  # Write your code here\nsliced   = None  # Write your code here\n\nprint('1D:', arr_1d)\nprint('2D:\\n', arr_2d)\nprint('3D shape:', arr_3d.shape if arr_3d is not None else None)\nprint('Reshaped:', reshaped)\nprint('Sliced:', sliced)",
          },
        },
        samples: [
          {
            input: "",
            output:
              "1D: [1 2 3 4 5]\n2D:\n [[1 2 3]\n [4 5 6]\n [7 8 9]]\n3D shape: (2, 3, 4)\nReshaped: [[1]\n [2]\n [3]\n [4]\n [5]]\nSliced: [1 2 3]\n",
          },
        ],
      },
      {
        part: "b",
        title: "Array Mathematics",
        concepts: ["NumPy Vectorization", "Matrix Arithmetic", "Broadcasting"],
        hints: [
          "Use standard arithmetic operators (+, -, *, /) to perform element-wise array operations in NumPy.",
          "Use np.dot() or the '@' operator to perform matrix multiplication.",
          "Understand broadcasting: NumPy's mechanism to perform operations on arrays of different shapes.",
        ],
        problemStatement:
          "Develop a Python script to create two arrays of the same shape and perform element-wise addition, subtraction, multiplication, and division; additionally, calculate the dot product and cross product of two vectors.",
        theory:
          "NumPy supports vectorized element-wise operations: a+b, a-b, a*b, a/b operate on all elements simultaneously. np.dot(a,b) computes dot product (sum of element products). np.cross(a,b) computes the cross product of two 3D vectors.",
        algorithm:
          "1. Create a=[1,2,3], b=[4,5,6]\n2. Element-wise: a+b, a-b, a*b, a/b\n3. Dot product: np.dot(a,b)\n4. Cross product: np.cross(a,b)\n5. Print all results",
        flowchart: {
          nodes: [
            { id: "1", type: "start", label: "Start" },
            { id: "2", type: "process", label: "Create arrays a, b" },
            { id: "3", type: "process", label: "Element-wise: +, -, *, /" },
            {
              id: "4",
              type: "process",
              label: "np.dot(a,b) and np.cross(a,b)",
            },
            { id: "5", type: "output", label: "Print all results" },
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
          supportedLanguages: ["python"],
          templates: {
            python:
              "import numpy as np\n\na = np.array([1, 2, 3])\nb = np.array([4, 5, 6])\n\n# Write your code here\nprint('Addition:',        a + b)\nprint('Subtraction:',     a - b)\nprint('Multiplication:',  a * b)\nprint('Division:',        a / b)\nprint('Dot product:',     np.dot(a, b))\nprint('Cross product:',   np.cross(a, b))",
          },
        },
        samples: [
          {
            input: "",
            output:
              "Addition: [5 7 9]\nSubtraction: [-3 -3 -3]\nMultiplication: [ 4 10 18]\nDivision: [0.25 0.4  0.5 ]\nDot product: 32\nCross product: [-3  6 -3]\n",
          },
        ],
      },
      {
        part: "c",
        title: "Statistical Operations",
        concepts: [
          "NumPy Statistics",
          "Descriptive Statistics",
          "Data Aggregation",
        ],
        hints: [
          "Use NumPy functions like np.mean(), np.median(), and np.std() to compute descriptive statistics.",
          "Specify the axis parameter (axis=0 for columns, axis=1 for rows) to calculate statistics along a specific dimension.",
          "Find minimum and maximum values using np.min() and np.max() respectively.",
        ],
        problemStatement:
          "Write a Python program to calculate mean, median, standard deviation, variance, and correlation coefficients of a given array.",
        theory:
          "NumPy provides: np.mean(), np.median(), np.std(), np.var(), np.corrcoef(). These operate on arrays and return scalar or matrix results. np.corrcoef() returns a correlation matrix. These are fundamental descriptive statistics used in data analysis.",
        algorithm:
          "1. Create or read array\n2. Compute mean, median, std, var\n3. Compute correlation with a second array using corrcoef()\n4. Print all statistics",
        flowchart: {
          nodes: [
            { id: "1", type: "start", label: "Start" },
            { id: "2", type: "input", label: "Read or create array" },
            {
              id: "3",
              type: "process",
              label: "Compute mean, median, std, var",
            },
            {
              id: "4",
              type: "process",
              label: "Compute corrcoef for two arrays",
            },
            { id: "5", type: "output", label: "Print all statistics" },
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
          supportedLanguages: ["python"],
          templates: {
            python:
              "import numpy as np\n\ndata = np.array([10, 20, 30, 40, 50, 60, 70, 80, 90, 100])\ndata2 = np.array([15, 25, 35, 45, 55, 65, 75, 85, 95, 105])\n\n# Write your code here\nprint(f'Mean:               {np.mean(data)}')\nprint(f'Median:             {np.median(data)}')\nprint(f'Standard Deviation: {np.std(data):.4f}')\nprint(f'Variance:           {np.var(data):.4f}')\nprint(f'Correlation:\\n{np.corrcoef(data, data2)}')",
          },
        },
        samples: [
          {
            input: "",
            output:
              "Mean:               55.0\nMedian:             55.0\nStandard Deviation: 28.7228\nVariance:           825.0000\nCorrelation:\n[[1. 1.]\n [1. 1.]]\n",
          },
        ],
      },
    ],
  },

  // ── Exp 10: Pandas ────────────────────────────────────────────────────────────
  {
    _id: new ObjectId("685b2a1f3c4e8d0012a7b60a"),
    subjectId: new ObjectId("685b2a1f3c4e8d0012a7b003"),
    experimentNumber: 10,
    subExperiments: [
      {
        part: "a",
        title: "Data Analysis on Global COVID-19 Dataset",
        concepts: ["Pandas DataFrames", "Data Filtering", "Data Aggregation"],
        hints: [
          "Import pandas as pd and read the dataset using pd.read_csv().",
          "Use head() and info() to quickly inspect the DataFrame structure.",
          "Perform filtering (e.g. df[df['cases'] > 1000]) and group data by country/region using groupby().",
        ],
        problemStatement:
          "Load a CSV file of global COVID-19 cases into a DataFrame, display the first few rows, check data types, and summarize basic statistics. Perform data cleaning to handle missing values and duplicates, execute aggregation operations, and generate various plots (line, bar, histogram, scatter) to visualize trends and relationships.",
        theory:
          "Pandas DataFrame is a 2D labeled data structure. pd.read_csv() loads CSV files. head(), dtypes, describe() give basic info. dropna() removes missing values, fillna() fills them. groupby().agg() aggregates data. matplotlib.pyplot provides line, bar, histogram, and scatter plots.",
        algorithm:
          "1. pd.read_csv('covid.csv') — load data\n2. head(), dtypes, describe() — explore\n3. dropna(), drop_duplicates() — clean\n4. groupby('country').sum() — aggregate\n5. plt.plot(), bar(), hist(), scatter() — visualize",
        flowchart: {
          nodes: [
            { id: "1", type: "start", label: "Start" },
            { id: "2", type: "process", label: "Load CSV into DataFrame" },
            {
              id: "3",
              type: "process",
              label: "Explore: head, dtypes, describe",
            },
            {
              id: "4",
              type: "process",
              label: "Clean: dropna, drop_duplicates",
            },
            { id: "5", type: "process", label: "Aggregate: groupby + sum" },
            { id: "6", type: "output", label: "Generate plots" },
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
          supportedLanguages: ["python"],
          templates: {
            python:
              "import pandas as pd\nimport matplotlib.pyplot as plt\n\n# Write your code here\n# 1. Load: df = pd.read_csv('covid.csv')\n# 2. Explore: print(df.head()); print(df.dtypes); print(df.describe())\n# 3. Clean: df.dropna(inplace=True); df.drop_duplicates(inplace=True)\n# 4. Aggregate: country_data = df.groupby('Country')['Cases'].sum()\n# 5. Plot: line, bar, histogram, scatter\n\ndf = pd.DataFrame({\n    'Date': pd.date_range('2021-01-01', periods=10),\n    'Cases': [100, 150, 200, 180, 220, 300, 250, 400, 350, 500],\n    'Deaths': [5, 8, 10, 9, 11, 15, 12, 20, 18, 25]\n})\nprint(df.head())\nprint(df.describe())\n\nplt.figure(figsize=(10, 4))\nplt.plot(df['Date'], df['Cases'], label='Cases')\nplt.title('COVID-19 Cases Trend')\nplt.xlabel('Date')\nplt.ylabel('Cases')\nplt.legend()\nplt.tight_layout()\nplt.show()",
          },
        },
        samples: [
          {
            input: "",
            output:
              "   Date  Cases  Deaths\n0  2021-01-01    100       5\n1  2021-01-02    150       8\n...\n(Plot displayed)\n",
          },
        ],
      },
      {
        part: "b",
        title: "Data Analysis on Iris Dataset",
        concepts: [
          "Pandas DataFrames",
          "Statistical Grouping",
          "Descriptive Analysis",
        ],
        hints: [
          "Load the Iris dataset and inspect group statistics using groupby('species').mean().",
          "Check for missing data using isnull().sum() and handle it if necessary.",
          "Use describe() to obtain standard summary statistics for numerical features (mean, std, min, max, quartiles).",
        ],
        problemStatement:
          "Using the Iris dataset, read the first 8 rows, display column names, fill missing data with column means, remove rows with missing values, group data by species, and calculate/display mean, minimum, and maximum values for the Sepal length column.",
        theory:
          "The Iris dataset is a classic ML dataset with 150 samples of 3 flower species. Pandas operations: head(8), columns, fillna(df.mean()), dropna(), groupby('Species')['SepalLengthCm'].agg(['mean','min','max']). Groupby enables split-apply-combine data analysis.",
        algorithm:
          "1. Load Iris CSV (or use sklearn.datasets)\n2. head(8); print columns\n3. fillna(df.mean()) for missing values\n4. dropna() to remove remaining NaN rows\n5. groupby('Species')['SepalLengthCm'].agg(['mean','min','max'])\n6. Print results",
        flowchart: {
          nodes: [
            { id: "1", type: "start", label: "Start" },
            { id: "2", type: "process", label: "Load Iris dataset" },
            { id: "3", type: "process", label: "head(8), columns" },
            { id: "4", type: "process", label: "fillna(mean) + dropna" },
            {
              id: "5",
              type: "process",
              label: "groupby Species: mean, min, max",
            },
            { id: "6", type: "output", label: "Print statistics" },
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
          supportedLanguages: ["python"],
          templates: {
            python:
              "import pandas as pd\nfrom sklearn.datasets import load_iris\n\niris = load_iris(as_frame=True)\ndf = iris.frame\ndf.columns = ['SepalLengthCm','SepalWidthCm','PetalLengthCm','PetalWidthCm','Species']\n\n# Write your code here\nprint('First 8 rows:')\nprint(df.head(8))\nprint('\\nColumns:', df.columns.tolist())\n\n# Fill missing values with column means\ndf.fillna(df.mean(numeric_only=True), inplace=True)\ndf.dropna(inplace=True)\n\n# Group by species and compute stats for Sepal Length\nstats = df.groupby('Species')['SepalLengthCm'].agg(['mean','min','max'])\nprint('\\nSepal Length stats by species:')\nprint(stats)",
          },
        },
        samples: [
          {
            input: "",
            output:
              "First 8 rows:\n   SepalLengthCm  ...\n0            5.1  ...\n...\nSepal Length stats by species:\n         mean  min  max\n0       5.006  4.3  5.8\n1       5.936  4.9  7.0\n2       6.588  4.9  7.9\n",
          },
        ],
      },
      {
        part: "c",
        title: "Data Analysis on Cars Dataset",
        concepts: [
          "Pandas Data Manipulation",
          "Sorting and Filtering",
          "Data Cleaning",
        ],
        hints: [
          "Read the cars dataset and filter rows based on conditions (e.g., horsepower > 150 or mpg > 30).",
          "Sort the DataFrame by specific columns like price or fuel efficiency using sort_values().",
          "Calculate summary metrics such as the average mileage or total count of cars per manufacturer.",
        ],
        problemStatement:
          "Using the Cars dataset, create a scatter plot of Age vs. Price, a histogram of kilometers driven, a bar plot of distribution by fuel type, a pie chart for fuel type percentage distribution, and a box plot for car prices across different fuel types.",
        theory:
          "Matplotlib and Seaborn provide various plot types. plt.scatter() for scatter plots, plt.hist() for histograms, df['col'].value_counts().plot.bar() for bar charts, plt.pie() for pie charts, seaborn.boxplot() for box plots. Each chart type reveals different patterns in data.",
        algorithm:
          "1. Load Cars CSV into DataFrame\n2. Scatter: Age vs Price\n3. Histogram: km_driven\n4. Bar: fuel type distribution\n5. Pie: fuel type percentages\n6. Box: price by fuel type\n7. plt.show() each or save",
        flowchart: {
          nodes: [
            { id: "1", type: "start", label: "Start" },
            { id: "2", type: "process", label: "Load Cars dataset" },
            { id: "3", type: "process", label: "Create scatter: Age vs Price" },
            { id: "4", type: "process", label: "Create histogram: km driven" },
            { id: "5", type: "process", label: "Bar, pie, box plots" },
            { id: "6", type: "output", label: "Display all charts" },
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
          supportedLanguages: ["python"],
          templates: {
            python:
              "import pandas as pd\nimport matplotlib.pyplot as plt\nimport seaborn as sns\n\n# Create sample cars DataFrame\ndf = pd.DataFrame({\n    'Age': [2, 5, 3, 7, 1, 4, 6, 2, 8, 3],\n    'Price': [800000, 450000, 650000, 250000, 950000, 550000, 300000, 750000, 200000, 620000],\n    'km_driven': [15000, 60000, 30000, 80000, 5000, 50000, 70000, 20000, 100000, 35000],\n    'fuel': ['Petrol','Diesel','Petrol','Diesel','Petrol','CNG','Diesel','Petrol','Diesel','CNG']\n})\n\n# Write your code here\n# 1. Scatter: Age vs Price\nplt.scatter(df['Age'], df['Price'])\nplt.title('Age vs Price'); plt.xlabel('Age'); plt.ylabel('Price'); plt.show()\n\n# 2. Histogram: km_driven\n# 3. Bar: fuel type count\n# 4. Pie: fuel type percentages\n# 5. Box: price by fuel type",
          },
        },
        samples: [{ input: "", output: "(5 plots displayed)\n" }],
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

    // Only removes Python data — does NOT touch C Programming or OS entries
    await Subject.deleteMany({ code: "VSEC202" });
    await Experiment.deleteMany({
      subjectId: new ObjectId("685b2a1f3c4e8d0012a7b003"),
    });
    console.log("Cleared existing Python data.");

    await Subject.insertMany(subjects);
    console.log(`Seeded ${subjects.length} subject(s).`);

    await Experiment.insertMany(experiments);
    console.log(`Seeded ${experiments.length} Python experiment(s).`);

    console.log("Python seed completed successfully!");
  } catch (err) {
    console.error("Seeding error:", err);
  } finally {
    await mongoose.connection.close();
    console.log("Connection closed.");
  }
};

seedDB();
