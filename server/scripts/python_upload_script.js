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
    problemStatement:
      "Learn basic programming with Python's syntax, variables, data types, operators, and input/output functions.",
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
        difficulty: "Easy",
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
        referenceSolution: {
          python:
            '# Program to generate a personalized greeting\n\n# Take user input for name\nname = input("Enter your name: ")\n\n# Generate greeting message\n# Using string concatenation\ngreeting = "Hello, " + name + "! Welcome to the program."\n\n# Display the greeting\nprint(greeting)\n',
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
        difficulty: "Easy",
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
        referenceSolution: {
          python:
            "# Program to calculate areas of circle, rectangle, and triangle\n# Using functions and user input for flexibility\n\nimport math\n\n# Function to calculate area of a circle\ndef area_circle(radius):\n    # Formula: πr^2\n    return math.pi * radius * radius\n\n# Function to calculate area of a rectangle\ndef area_rectangle(length, width):\n    # Formula: length × width\n    return length * width\n\n# Function to calculate area of a triangle\ndef area_triangle(base, height):\n    # Formula: (1/2) × base × height\n    return 0.5 * base * height\n\n# Display menu to user\nprint('Choose shape to calculate area:')\nprint('1. Circle')\nprint('2. Rectangle')\nprint('3. Triangle')\n\nchoice = input('Enter your choice (1/2/3): ')\n\n# Perform calculation based on user choice\nif choice == '1':\n    r = float(input('Enter radius of circle: '))\n    print('Area of circle is:', area_circle(r))\n\nelif choice == '2':\n    l = float(input('Enter length of rectangle: '))\n    w = float(input('Enter width of rectangle: '))\n    print('Area of rectangle is:', area_rectangle(l, w))\n\nelif choice == '3':\n    b = float(input('Enter base of triangle: '))\n    h = float(input('Enter height of triangle: '))\n    print('Area of triangle is:', area_triangle(b, h))\n\nelse:\n    print('Invalid choice! Please select 1, 2, or 3.')\n",
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
        difficulty: "Easy",
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
        referenceSolution: {
          python:
            '# Program for unit conversion (Currency, Temperature, Length)\n# Supports: Rupees to Dollar, Celsius to Fahrenheit, Inch to Feet\n\n# Function to convert INR to USD\ndef rupees_to_dollar(inr):\n    # Assuming fixed conversion rate (example: 1 USD = 83 INR)\n    rate = 83\n    return inr / rate\n\n# Function to convert Celsius to Fahrenheit\ndef celsius_to_fahrenheit(c):\n    # Formula: (C × 9/5) + 32\n    return (c * 9/5) + 32\n\n# Function to convert Inch to Feet\ndef inch_to_feet(inch):\n    # 1 foot = 12 inches\n    return inch / 12\n\n# Menu display\nprint("Choose conversion type:")\nprint("1. Rupees to Dollar")\nprint("2. Celsius to Fahrenheit")\nprint("3. Inch to Feet")\n\nchoice = input("Enter your choice (1/2/3): ")\n\n# Perform conversion based on user choice\nif choice == \'1\':\n    inr = float(input("Enter amount in Rupees: "))\n    print("USD:", rupees_to_dollar(inr))\n\nelif choice == \'2\':\n    c = float(input("Enter temperature in Celsius: "))\n    print("Fahrenheit:", celsius_to_fahrenheit(c))\n\nelif choice == \'3\':\n    inch = float(input("Enter length in Inches: "))\n    print("Feet:", inch_to_feet(inch))\n\nelse:\n    print("Invalid choice!")\n',
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
        difficulty: "Easy",
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
        referenceSolution: {
          python:
            '# Program to calculate Gross Salary of an employee\n\n# Take input for Basic Salary (BS)\nbs = float(input("Enter Basic Salary (BS): "))\n\n# Calculate allowances based on given percentages\n# DA = 70% of BS\nda = 0.70 * bs\n\n# TA = 30% of BS\nta = 0.30 * bs\n\n# HRA = 10% of BS\nhra = 0.10 * bs\n\n# Calculate Gross Salary\n# Gross Salary = BS + DA + TA + HRA\ngross_salary = bs + da + ta + hra\n\n# Display results\nprint("\\nSalary Details:")\nprint("Basic Salary:", bs)\nprint("Dearness Allowance (DA):", da)\nprint("Travel Allowance (TA):", ta)\nprint("House Rent Allowance (HRA):", hra)\nprint("Gross Salary:", gross_salary)\n',
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
        difficulty: "Easy",
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
        referenceSolution: {
          python:
            '# Program to calculate Simple Interest\n\n# Take user input for Principal, Rate, and Time\nprincipal = float(input("Enter Principal amount: "))\nrate = float(input("Enter Rate of Interest (in %): "))\ntime = float(input("Enter Time period (in years): "))\n\n# Calculate Simple Interest using formula\n# SI = (P × R × T) / 100\nsimple_interest = (principal * rate * time) / 100\n\n# Display result\nprint("\\nSimple Interest Calculation")\nprint("Principal:", principal)\nprint("Rate:", rate)\nprint("Time:", time)\nprint("Simple Interest:", simple_interest)\n',
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
        difficulty: "Easy",
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
        referenceSolution: {
          python:
            '# Program to perform basic arithmetic operations\n\n# Take input from user\nnum1 = float(input("Enter first number: "))\nnum2 = float(input("Enter second number: "))\n\n# Perform arithmetic operations\naddition = num1 + num2\nsubtraction = num1 - num2\nmultiplication = num1 * num2\n\n# Handle division safely (avoid division by zero)\nif num2 != 0:\n    division = num1 / num2\n    modulus = num1 % num2\nelse:\n    division = "Undefined (cannot divide by zero)"\n    modulus = "Undefined (cannot mod by zero)"\n\n# Display results\nprint("\\nArithmetic Operations Result:")\nprint("Addition:", addition)\nprint("Subtraction:", subtraction)\nprint("Multiplication:", multiplication)\nprint("Division:", division)\nprint("Modulus:", modulus)\n',
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
    problemStatement:
      "Mastering Python New Data Structures for Practical Applications.",
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
        difficulty: "Medium",
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
        referenceSolution: {
          python:
            '# Program to manage a task list using lists and tuples\n# Each task is stored as a tuple: (task_name, priority)\n# List is used to store multiple tasks\n\n# Initialize empty task list\ntasks = []\n\n# Function to display tasks\ndef display_tasks():\n    if not tasks:\n        print("No tasks available.")\n    else:\n        print("\\nCurrent Task List:")\n        for i, task in enumerate(tasks):\n            print(f"{i + 1}. Task: {task[0]}, Priority: {task[1]}")\n\n# Function to add a task\ndef add_task(name, priority):\n    # Store task as tuple\n    task = (name, priority)\n    tasks.append(task)\n    print("Task added successfully!")\n\n# Function to remove a task\ndef remove_task(index):\n    if 0 <= index < len(tasks):\n        removed = tasks.pop(index)\n        print(f"Removed task: {removed[0]}")\n    else:\n        print("Invalid index!")\n\n# Function to update a task\ndef update_task(index, new_name, new_priority):\n    if 0 <= index < len(tasks):\n        tasks[index] = (new_name, new_priority)\n        print("Task updated successfully!")\n    else:\n        print("Invalid index!")\n\n# Function to sort tasks by priority (ascending)\ndef sort_tasks():\n    global tasks\n    tasks = sorted(tasks, key=lambda x: x[1])\n    print("Tasks sorted by priority!")\n\n# Menu-driven program\nwhile True:\n    print("\\n--- Task Manager ---")\n    print("1. Add Task")\n    print("2. Remove Task")\n    print("3. Update Task")\n    print("4. Display Tasks")\n    print("5. Sort Tasks by Priority")\n    print("6. Exit")\n\n    choice = input("Enter your choice: ")\n\n    if choice == \'1\':\n        name = input("Enter task name: ")\n        priority = int(input("Enter priority (lower number = higher priority): "))\n        add_task(name, priority)\n\n    elif choice == \'2\':\n        display_tasks()\n        idx = int(input("Enter task number to remove: ")) - 1\n        remove_task(idx)\n\n    elif choice == \'3\':\n        display_tasks()\n        idx = int(input("Enter task number to update: ")) - 1\n        name = input("Enter new task name: ")\n        priority = int(input("Enter new priority: "))\n        update_task(idx, name, priority)\n\n    elif choice == \'4\':\n        display_tasks()\n\n    elif choice == \'5\':\n        sort_tasks()\n\n    elif choice == \'6\':\n        print("Exiting program...")\n        break\n\n    else:\n        print("Invalid choice! Please try again.")\n',
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
        difficulty: "Medium",
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
        referenceSolution: {
          python:
            '# Program to demonstrate set operations using student enrollments\n# We use sets to store students enrolled in different exams/courses\n\n# Sample student enrollments (set data structure)\ncet_students = {"Aarav", "Neha", "Rohan", "Isha", "Vikram"}\njee_students = {"Rohan", "Isha", "Karan", "Meera", "Aarav"}\nneet_students = {"Neha", "Meera", "Sahil", "Aarav", "Divya"}\n\n# Display original sets\nprint("CET Students:", cet_students)\nprint("JEE Students:", jee_students)\nprint("NEET Students:", neet_students)\n\n# UNION: Students appearing for any exam\nall_students = cet_students.union(jee_students).union(neet_students)\nprint("\\nAll Students (Union):", all_students)\n\n# INTERSECTION: Students common in CET and JEE\ncet_jee_common = cet_students.intersection(jee_students)\nprint("\\nCommon in CET and JEE:", cet_jee_common)\n\n# DIFFERENCE: Students in CET but not in JEE\ncet_not_jee = cet_students.difference(jee_students)\nprint("\\nCET but not JEE:", cet_not_jee)\n\n# Students appearing only in NEET (not in CET or JEE)\nneet_only = neet_students.difference(cet_students.union(jee_students))\nprint("\\nOnly NEET Students:", neet_only)\n\n# Example of symmetric difference (in either CET or JEE but not both)\nsym_diff = cet_students.symmetric_difference(jee_students)\nprint("\\nCET or JEE but not both:", sym_diff)\n',
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
        difficulty: "Medium",
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
        referenceSolution: {
          python:
            '# Program to create, update, and manipulate a dictionary of student records\n# Each student record contains grades and attendance details\n\n# Dictionary to store student records\n# Structure: {student_name: {"grade": value, "attendance": value}}\nstudents = {}\n\n# Function to add a student record\ndef add_student(name, grade, attendance):\n    students[name] = {\n        "grade": grade,\n        "attendance": attendance\n    }\n    print(f"Student {name} added successfully!")\n\n# Function to update student record\ndef update_student(name, grade=None, attendance=None):\n    if name in students:\n        if grade is not None:\n            students[name]["grade"] = grade\n        if attendance is not None:\n            students[name]["attendance"] = attendance\n        print(f"Student {name} updated successfully!")\n    else:\n        print("Student not found!")\n\n# Function to delete student record\ndef delete_student(name):\n    if name in students:\n        del students[name]\n        print(f"Student {name} deleted successfully!")\n    else:\n        print("Student not found!")\n\n# Function to display all records\ndef display_students():\n    if not students:\n        print("No student records found.")\n    else:\n        print("\\nStudent Records:")\n        for name, info in students.items():\n            print(f"Name: {name}, Grade: {info[\'grade\']}, Attendance: {info[\'attendance\']}%")\n\n# Menu-driven program\nwhile True:\n    print("\\n--- Student Record Management ---")\n    print("1. Add Student")\n    print("2. Update Student")\n    print("3. Delete Student")\n    print("4. Display Students")\n    print("5. Exit")\n\n    choice = input("Enter your choice: ")\n\n    if choice == \'1\':\n        name = input("Enter student name: ")\n        grade = input("Enter grade: ")\n        attendance = float(input("Enter attendance (%): "))\n        add_student(name, grade, attendance)\n\n    elif choice == \'2\':\n        name = input("Enter student name to update: ")\n        grade = input("Enter new grade (or press Enter to skip): ")\n        attendance_input = input("Enter new attendance (or press Enter to skip): ")\n\n        grade = grade if grade != "" else None\n        attendance = float(attendance_input) if attendance_input != "" else None\n\n        update_student(name, grade, attendance)\n\n    elif choice == \'3\':\n        name = input("Enter student name to delete: ")\n        delete_student(name)\n\n    elif choice == \'4\':\n        display_students()\n\n    elif choice == \'5\':\n        print("Exiting program...")\n        break\n\n    else:\n        print("Invalid choice! Please try again.")\n',
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
    problemStatement: "Understanding control statements and loops in Python.",
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
        difficulty: "Easy",
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
        referenceSolution: {
          python:
            "# Program to print a triangle pattern in Python\n# This demonstrates the difference between C and Python syntax\n\n# In C, we use braces {}, semicolons ; and printf()\n# In Python, we use indentation and simpler syntax\n\n# Take number of rows from user\nrows = int(input(\"Enter number of rows: \"))\n\n# Print triangle pattern\n# Each row prints increasing number of '*' characters\nfor i in range(1, rows + 1):\n    # In Python, no need for printf or format specifiers\n    # Just use print() with string multiplication\n    print('* ' * i)\n\n# Example Output (rows = 3):\n# * \n# * * \n# * * *\n",
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
        difficulty: "Easy",
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
        referenceSolution: {
          python:
            '# Program to check whether numbers are even or odd using conditional statements and loops\n\n# Take number of inputs from user\nn = int(input("Enter how many numbers you want to check: "))\n\n# Loop to take multiple numbers and check each one\nfor i in range(n):\n    # Take number input\n    num = int(input("Enter a number: "))\n\n    # Check even or odd using conditional statement\n    if num % 2 == 0:\n        print(num, "is Even")\n    else:\n        print(num, "is Odd")\n\n# End of program\n',
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
        difficulty: "Medium",
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
        referenceSolution: {
          python:
            '# Program to check whether input is digit, lowercase, uppercase, or special character\n# Using if-else ladder\n\n# Take input from user (single character)\nch = input("Enter a single character: ")\n\n# Check conditions using if-else ladder\nif len(ch) != 1:\n    print("Please enter only one character!")\n\nelif ch.isdigit():\n    # Checks if character is a digit (0-9)\n    print("It is a Digit.")\n\nelif ch.islower():\n    # Checks if character is lowercase letter\n    print("It is a Lowercase Character.")\n\nelif ch.isupper():\n    # Checks if character is uppercase letter\n    print("It is an Uppercase Character.")\n\nelse:\n    # If none of the above, it is a special character\n    print("It is a Special Character.")\n',
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
        difficulty: "Easy",
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
        referenceSolution: {
          python:
            '# Program to generate multiplication table of a given number\n# Using loop structure in Python\n\n# Take input from user\nnum = int(input("Enter a number to generate its multiplication table: "))\n\n# Take range input (optional: default 10)\nlimit = 10\n\nprint("\\nMultiplication Table of", num)\n\n# Loop to generate table\nfor i in range(1, limit + 1):\n    result = num * i\n    print(num, "x", i, "=", result)\n\n# End of program\n',
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
        difficulty: "Medium",
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
        referenceSolution: {
          python:
            '# Program to print Fibonacci sequence using a while loop\n\n# Take number of terms from user\nn = int(input("Enter number of terms: "))\n\n# First two terms of Fibonacci sequence\na = 0\nb = 1\ncount = 0\n\n# Check if number of terms is valid\nif n <= 0:\n    print("Please enter a positive integer")\nelif n == 1:\n    print("Fibonacci sequence:")\n    print(a)\nelse:\n    print("Fibonacci sequence:")\n\n    # Loop to generate sequence\n    while count < n:\n        print(a)\n        # Update values\n        temp = a + b\n        a = b\n        b = temp\n        count += 1\n',
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
        difficulty: "Easy",
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
        referenceSolution: {
          python:
            '# Program to compute factorial of a given number N\n# Using a loop\n\n# Take input from user\nn = int(input("Enter a number to find factorial: "))\n\n# Initialize result variable\nfact = 1\n\n# Check for negative numbers\nif n < 0:\n    print("Factorial is not defined for negative numbers.")\n\nelif n == 0 or n == 1:\n    print("Factorial of", n, "is 1")\n\nelse:\n    # Loop to calculate factorial\n    for i in range(1, n + 1):\n        fact = fact * i\n\n    print("Factorial of", n, "is", fact)\n',
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
        difficulty: "Medium",
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
        referenceSolution: {
          python:
            '# Program to check whether a number is prime using a function\n\n# Function to check prime number\ndef is_prime(num):\n    # Numbers less than or equal to 1 are not prime\n    if num <= 1:\n        return False\n\n    # Check divisibility from 2 to sqrt(num)\n    for i in range(2, int(num ** 0.5) + 1):\n        if num % i == 0:\n            return False\n\n    return True\n\n# Take input from user\nn = int(input("Enter a number: "))\n\n# Call function and display result\nif is_prime(n):\n    print(n, "is a Prime Number")\nelse:\n    print(n, "is Not a Prime Number")\n',
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
        difficulty: "Medium",
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
        referenceSolution: {
          python:
            '# Simple Calculator using functions\n# Performs addition, subtraction, multiplication, and division\n\n# Function for addition\ndef add(a, b):\n    return a + b\n\n# Function for subtraction\ndef subtract(a, b):\n    return a - b\n\n# Function for multiplication\ndef multiply(a, b):\n    return a * b\n\n# Function for division\ndef divide(a, b):\n    # Handle division by zero\n    if b == 0:\n        return "Error: Division by zero not allowed"\n    return a / b\n\n# Menu-driven calculator\nprint("--- Simple Calculator ---")\nprint("1. Addition")\nprint("2. Subtraction")\nprint("3. Multiplication")\nprint("4. Division")\n\nchoice = input("Enter your choice (1-4): ")\n\n# Take input numbers\na = float(input("Enter first number: "))\nb = float(input("Enter second number: "))\n\n# Perform operation based on user choice\nif choice == \'1\':\n    print("Result:", add(a, b))\nelif choice == \'2\':\n    print("Result:", subtract(a, b))\nelif choice == \'3\':\n    print("Result:", multiply(a, b))\nelif choice == \'4\':\n    print("Result:", divide(a, b))\nelse:\n    print("Invalid choice!")\n',
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
        difficulty: "Medium",
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
        referenceSolution: {
          python:
            '# Number Guessing Game using loops and conditional statements\n# Program generates a random number and user has to guess it\n\nimport random\n\n# Generate random number between 1 and 100\nsecret_number = random.randint(1, 100)\n\n# Initialize attempt counter\nattempts = 0\n\nprint("Welcome to the Number Guessing Game!")\nprint("I have selected a number between 1 and 100.")\nprint("Try to guess it!")\n\nwhile True:\n    # Take user input\n    guess = int(input("Enter your guess: "))\n    attempts += 1\n\n    # Check conditions\n    if guess < secret_number:\n        print("Too low! Try again.")\n    elif guess > secret_number:\n        print("Too high! Try again.")\n    else:\n        print("Congratulations! You guessed the correct number.")\n        print("Total attempts:", attempts)\n        break\n\n# End of game\n',
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
    problemStatement:
      "To proficiently handle file operations, manage exceptions, and create Python packages and executable files.",
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
        difficulty: "Medium",
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
        referenceSolution: {
          python:
            '# Program to read a text file and print words of specified lengths\n# Demonstrates file handling, loops, and string processing\n\n# Ask user for file name\nfile_name = input("Enter the text file name (with .txt extension): ")\n\n# Ask user for word length criteria\nlengths_input = input("Enter word lengths to filter (comma separated, e.g., 3,4,5): ")\n\n# Convert input string into a list of integers\nlengths = [int(x.strip()) for x in lengths_input.split(",")]\n\ntry:\n    # Open file in read mode\n    file = open(file_name, "r")\n    content = file.read()\n    file.close()\n\n    # Convert text into words (split by whitespace)\n    words = content.split()\n\n    print("\\nWords matching specified lengths:")\n\n    # Loop through each word\n    for word in words:\n        # Remove punctuation (basic cleaning)\n        cleaned_word = word.strip(".,!?;:\\"\'()").lower()\n\n        # Check if word length matches user criteria\n        if len(cleaned_word) in lengths:\n            print(cleaned_word)\n\nexcept FileNotFoundError:\n    print("Error: File not found. Please check the file name.")\n',
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
        difficulty: "Hard",
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
        referenceSolution: {
          python:
            '# Program to find the two closest points from a CSV file (3D coordinates)\n# Each row in CSV is assumed to be: x,y,z\n# Uses Euclidean distance formula\n\nimport csv\nimport math\n\n# Function to calculate distance between two 3D points\ndef distance(p1, p2):\n    return math.sqrt((p1[0] - p2[0])**2 + \n                     (p1[1] - p2[1])**2 + \n                     (p1[2] - p2[2])**2)\n\n# Take CSV file name from user\nfile_name = input("Enter CSV file name: ")\n\n# List to store points\npoints = []\n\ntry:\n    # Read CSV file\n    with open(file_name, "r") as file:\n        reader = csv.reader(file)\n        for row in reader:\n            # Convert each row into a tuple of floats (x, y, z)\n            if len(row) >= 3:\n                x, y, z = float(row[0]), float(row[1]), float(row[2])\n                points.append((x, y, z))\n\n    # Check if enough points exist\n    if len(points) < 2:\n        print("Need at least two points to compute distance.")\n    else:\n        min_dist = float("inf")\n        closest_pair = (None, None)\n\n        # Compare all pairs of points\n        for i in range(len(points)):\n            for j in range(i + 1, len(points)):\n                d = distance(points[i], points[j])\n\n                if d < min_dist:\n                    min_dist = d\n                    closest_pair = (points[i], points[j])\n\n        # Display result\n        print("\\nClosest Points:")\n        print("Point 1:", closest_pair[0])\n        print("Point 2:", closest_pair[1])\n        print("Minimum Distance:", min_dist)\n\nexcept FileNotFoundError:\n    print("Error: CSV file not found.")\n',
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
        difficulty: "Medium",
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
        referenceSolution: {
          python:
            '# Program to read city names from a file, sort them alphabetically, and write to another file\n\n# Take input file name from user\ninput_file = input("Enter input file name: ")\n\n# Take output file name from user\noutput_file = input("Enter output file name: ")\n\ntry:\n    # Read city names from input file\n    with open(input_file, "r") as file:\n        cities = file.readlines()\n\n    # Remove newline characters and extra spaces\n    cities = [city.strip() for city in cities]\n\n    # Sort cities alphabetically (case-insensitive)\n    cities.sort(key=str.lower)\n\n    # Write sorted cities to output file\n    with open(output_file, "w") as file:\n        for city in cities:\n            file.write(city + "\\n")\n\n    print("Cities sorted and written successfully to", output_file)\n\nexcept FileNotFoundError:\n    print("Error: Input file not found.")\n',
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
        difficulty: "Medium",
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
        referenceSolution: {
          python:
            "# Steps to create an executable:\n# 1. pip install pyinstaller\n# 2. pyinstaller --onefile --name MyCalculator calculator.py\n# 3. Run dist/MyCalculator(.exe)\n\n# Sample program to package:\ndef simple_calculator():\n    a = float(input('First number: '))\n    op = input('Operator (+,-,*,/): ')\n    b = float(input('Second number: '))\n    if op == '+':          print(f'Result: {a+b}')\n    elif op == '-':        print(f'Result: {a-b}')\n    elif op == '*':        print(f'Result: {a*b}')\n    elif op == '/' and b:  print(f'Result: {a/b}')\n    else:                  print('Invalid input')\n\nif __name__ == '__main__':\n    simple_calculator()",
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
    problemStatement:
      "Handle errors and exceptions in Python programs, ensuring robust and fault-tolerant code. Learn debugging skills to identify, diagnose, and fix issues efficiently using scientific debugging methods.",
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
        difficulty: "Medium",
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
        referenceSolution: {
          python:
            '# Program to perform division with exception handling\n# Handles division by zero and invalid input errors\n\ntry:\n    # Take input from user\n    num1 = float(input("Enter first number (numerator): "))\n    num2 = float(input("Enter second number (denominator): "))\n\n    # Perform division\n    result = num1 / num2\n\n    # Display result\n    print("\\nResult of division:", result)\n\n# Handle division by zero error\nexcept ZeroDivisionError:\n    print("Error: Division by zero is not allowed.")\n\n# Handle invalid input (e.g., alphabets instead of numbers)\nexcept ValueError:\n    print("Error: Invalid input. Please enter numeric values only.")\n\n# General exception handling\nexcept Exception as e:\n    print("An unexpected error occurred:", e)\n\n# End of program\n',
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
        difficulty: "Medium",
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
        referenceSolution: {
          python:
            '# Program to simulate a banking system with custom exceptions\n\n# Custom exception for insufficient funds\nclass InsufficientFundsError(Exception):\n    pass\n\n# Custom exception for invalid account number\nclass InvalidAccountError(Exception):\n    pass\n\n# Simple bank database (dictionary)\naccounts = {\n    "1001": 5000,\n    "1002": 3000,\n    "1003": 10000\n}\n\n# Function to withdraw money\ndef withdraw(account_number, amount):\n    # Check if account exists\n    if account_number not in accounts:\n        raise InvalidAccountError("Invalid account number!")\n\n    # Check sufficient balance\n    if amount > accounts[account_number]:\n        raise InsufficientFundsError("Insufficient funds in account!")\n\n    # Perform withdrawal\n    accounts[account_number] -= amount\n    return accounts[account_number]\n\n# Main program\ntry:\n    acc_no = input("Enter account number: ")\n    amt = float(input("Enter amount to withdraw: "))\n\n    balance = withdraw(acc_no, amt)\n    print("Withdrawal successful!")\n    print("Remaining balance:", balance)\n\nexcept InvalidAccountError as e:\n    print("Error:", e)\n\nexcept InsufficientFundsError as e:\n    print("Error:", e)\n\nexcept ValueError:\n    print("Error: Invalid input for amount!")\n\nexcept Exception as e:\n    print("Unexpected error:", e)\n',
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
        difficulty: "Hard",
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
        referenceSolution: {
          python:
            '# Program demonstrating logging in Python\n# Shows INFO, DEBUG, and ERROR levels using logging module\n\nimport logging\n\n# Configure logging\nlogging.basicConfig(\n    level=logging.DEBUG,  # Set lowest level to capture all logs\n    format=\'%(asctime)s - %(levelname)s - %(message)s\'\n)\n\nlogging.info("Program started")\n\ntry:\n    # Take user input\n    num1 = float(input("Enter first number: "))\n    logging.debug(f"First number entered: {num1}")\n\n    num2 = float(input("Enter second number: "))\n    logging.debug(f"Second number entered: {num2}")\n\n    # Check division\n    logging.info("Performing division operation")\n    result = num1 / num2\n\n    logging.info("Division successful")\n    print("Result:", result)\n\nexcept ZeroDivisionError:\n    logging.error("Attempted division by zero")\n    print("Error: Cannot divide by zero")\n\nexcept ValueError:\n    logging.error("Invalid input provided by user")\n    print("Error: Please enter valid numeric values")\n\nexcept Exception as e:\n    logging.error(f"Unexpected error occurred: {e}")\n    print("Unexpected error occurred")\n\nfinally:\n    logging.info("Program ended")\n',
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
        difficulty: "Medium",
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
        referenceSolution: {
          python:
            '# Demonstration program for Python debugger (pdb)\n# This program contains intentional logical flow to practice debugging\n\nimport pdb\n\n# Function with intentional mistake for debugging practice\ndef calculate_average(numbers):\n    total = 0\n    count = 0\n\n    # Set breakpoint here to inspect variables\n    pdb.set_trace()\n\n    for num in numbers:\n        total += num\n        count += 1\n\n    # Intentional potential issue: division by zero if list is empty\n    average = total / count\n    return average\n\n# Sample data\nnums = [10, 20, 30, 40]\n\nprint("Program started")\n\n# Call function\nresult = calculate_average(nums)\n\nprint("Average is:", result)\n\nprint("Program ended")\n\n"""\nDEBUGGING GUIDE (for students):\n\n1. Run program in terminal:\n   python filename.py\n\n2. When execution stops at pdb.set_trace(), use commands:\n\n   - n (next line execution)\n   - s (step into function)\n   - c (continue execution)\n   - p variable_name (print variable value)\n   - l (list current code)\n\n3. Example checks:\n   p total\n   p count\n   p numbers\n\n4. Observe how values change step-by-step\n\n5. Remove pdb.set_trace() after debugging\n"""\n',
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
        difficulty: "Hard",
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
        referenceSolution: {
          python:
            '# Program with multiple intentional logic and runtime errors for debugging practice\n# Students are expected to identify and fix issues using scientific debugging (e.g., binary search debugging)\n\nimport random\n\n# Function to compute sum of even numbers incorrectly (intentional logic bug)\ndef sum_even_numbers(numbers):\n    total = 1  # BUG: should start from 0\n    for num in numbers:\n        if num % 2 = 0:  # BUG: assignment operator instead of comparison\n            total += num\n    return total\n\n# Function to compute factorial (intentional runtime and logic issues)\ndef factorial(n):\n    result = 1\n    for i in range(0, n):  # BUG: should be range(1, n+1)\n        result *= i        # BUG: multiplication by 0 causes wrong result\n    return result\n\n# Function to generate random list with possible hidden edge cases\ndef generate_numbers():\n    return [random.randint(-5, 5) for i in range(10)]\n\n# Main program\nprint("Program started")\n\nnums = generate_numbers()\nprint("Generated list:", nums)\n\n# Intentional runtime risk: division without check\navg = sum(nums) / len(nums)\nprint("Average:", avg)\n\n# Function calls\nprint("Sum of evens:", sum_even_numbers(nums))\nprint("Factorial of 5:", factorial(5))\n\nprint("Program ended")\n\n"""\nDEBUGGING INSTRUCTIONS (Scientific / Binary Search Debugging Approach):\n\n1. Identify symptoms:\n   - Wrong outputs\n   - Crashes or exceptions\n\n2. Use binary search debugging strategy:\n   Step 1: Comment out half of the program\n   Step 2: Check if error still exists\n   Step 3: Narrow down to smaller block\n   Step 4: Repeat until faulty line is found\n\n3. Suggested checkpoints:\n   - After generating list\n   - After sum_even_numbers()\n   - After factorial()\n\n4. Common errors to find:\n   - Assignment vs comparison error\n   - Incorrect loop range\n   - Wrong initialization\n   - Division by zero risk\n\n5. Fix one bug at a time and re-run program\n\n6. Validate final output with manual calculation\n"""\n',
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
    problemStatement:
      "Apply object-oriented programming (OOP) principles in Python to model real-world scenarios and systems.",
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
        difficulty: "Hard",
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
        referenceSolution: {
          python:
            '# Event Management System using OOP Concepts\n# Demonstrates Encapsulation, Inheritance, and Polymorphism\n\n# Base class: Event\nclass Event:\n    def __init__(self, name, date):\n        # Encapsulation: private attributes\n        self.__name = name\n        self.__date = date\n        self.participants = []\n        self.activities = []\n\n    # Getter methods (Encapsulation)\n    def get_name(self):\n        return self.__name\n\n    def get_date(self):\n        return self.__date\n\n    # Method to add participant\n    def register_participant(self, participant):\n        self.participants.append(participant)\n        print(participant.get_name(), "registered for", self.__name)\n\n    # Method to add activity\n    def add_activity(self, activity):\n        self.activities.append(activity)\n        print("Activity added:", activity.get_details())\n\n    # Polymorphic method (can be overridden)\n    def show_details(self):\n        print("Event:", self.__name)\n        print("Date:", self.__date)\n        print("Participants:")\n        for p in self.participants:\n            print(" -", p.get_name())\n        print("Activities:")\n        for a in self.activities:\n            print(" -", a.get_details())\n\n\n# Inheritance: Organizer is a type of Event Manager role\nclass Organizer:\n    def __init__(self, name, role):\n        self.name = name\n        self.role = role\n\n    def manage_event(self, event):\n        print(self.name, "is managing event:", event.get_name())\n\n\n# Participant class\nclass Participant:\n    def __init__(self, name, department):\n        self.name = name\n        self.department = department\n\n    def get_name(self):\n        return self.name\n\n\n# Activity base class (for polymorphism)\nclass Activity:\n    def get_details(self):\n        return "Generic Activity"\n\n\n# Derived Activity classes (Polymorphism)\nclass Competition(Activity):\n    def __init__(self, title, team_size):\n        self.title = title\n        self.team_size = team_size\n\n    def get_details(self):\n        return f"Competition: {self.title}, Team Size: {self.team_size}"\n\n\nclass Workshop(Activity):\n    def __init__(self, topic, speaker):\n        self.topic = topic\n        self.speaker = speaker\n\n    def get_details(self):\n        return f"Workshop: {self.topic}, Speaker: {self.speaker}"\n\n\n# Main Program\nprint("--- College Event Management System ---")\n\n# Create event\nfest = Event("Tech Fest 2026", "10-07-2026")\n\n# Create organizer\norg = Organizer("Bhavani", "Coordinator")\norg.manage_event(fest)\n\n# Create participants\np1 = Participant("Aarav", "CSE")\np2 = Participant("Neha", "IT")\n\n# Register participants\nfest.register_participant(p1)\nfest.register_participant(p2)\n\n# Create activities\nc1 = Competition("Coding Contest", 2)\nw1 = Workshop("AI Basics", "Dr. Sharma")\n\n# Add activities\nfest.add_activity(c1)\nfest.add_activity(w1)\n\n# Show event details (polymorphism in action)\nprint("\\nEvent Summary:")\nfest.show_details()\n',
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
        difficulty: "Hard",
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
        referenceSolution: {
          python:
            '# Online Shopping System using OOP principles\n# Demonstrates encapsulation, classes, and object interaction\n\n# Product class\nclass Product:\n    def __init__(self, product_id, name, price, stock):\n        self.product_id = product_id\n        self.name = name\n        self.price = price\n        self.stock = stock\n\n    def reduce_stock(self, quantity):\n        if quantity <= self.stock:\n            self.stock -= quantity\n            return True\n        return False\n\n    def __str__(self):\n        return f"{self.name} (Price: {self.price}, Stock: {self.stock})"\n\n\n# Customer class\nclass Customer:\n    def __init__(self, name):\n        self.name = name\n        self.cart = ShoppingCart()\n\n    def add_to_cart(self, product, quantity):\n        self.cart.add_item(product, quantity)\n\n    def checkout(self):\n        return self.cart.checkout()\n\n\n# Shopping Cart class\nclass ShoppingCart:\n    def __init__(self):\n        self.items = {}  # product -> quantity\n\n    # Add item to cart\n    def add_item(self, product, quantity):\n        if product.stock >= quantity:\n            if product in self.items:\n                self.items[product] += quantity\n            else:\n                self.items[product] = quantity\n            print(f"Added {quantity} of {product.name} to cart")\n        else:\n            print(f"Not enough stock for {product.name}")\n\n    # Calculate total cost\n    def calculate_total(self):\n        total = 0\n        for product, qty in self.items.items():\n            total += product.price * qty\n        return total\n\n    # Process order\n    def checkout(self):\n        print("\\nProcessing Order...")\n        for product, qty in self.items.items():\n            if product.reduce_stock(qty):\n                print(f"Purchased {qty} x {product.name}")\n            else:\n                print(f"Failed for {product.name}")\n        total = self.calculate_total()\n        self.items.clear()\n        print("Total Amount Paid:", total)\n        return total\n\n\n# Main Program\nprint("--- Online Shopping System ---")\n\n# Create products\np1 = Product(1, "Laptop", 50000, 5)\np2 = Product(2, "Headphones", 2000, 10)\np3 = Product(3, "Mouse", 500, 20)\n\n# Create customer\ncust = Customer("Aarav")\n\n# Display products\nprint("\\nAvailable Products:")\nprint(p1)\nprint(p2)\nprint(p3)\n\n# Add items to cart\ncust.add_to_cart(p1, 1)\ncust.add_to_cart(p2, 2)\ncust.add_to_cart(p3, 3)\n\n# Checkout\ncust.checkout()\n\n# Show remaining stock\nprint("\\nUpdated Inventory:")\nprint(p1)\nprint(p2)\nprint(p3)\n',
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
        difficulty: "Hard",
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
        referenceSolution: {
          python:
            '# Vehicle Rental System using OOP principles\n# Includes Vehicles, Rental Agency, and Rental Transactions\n\nfrom datetime import datetime, timedelta\n\n# ---------------- Vehicle Class ----------------\nclass Vehicle:\n    def __init__(self, vehicle_id, name, price_per_day):\n        self.vehicle_id = vehicle_id\n        self.name = name\n        self.price_per_day = price_per_day\n        self.is_available = True\n\n    def rent(self):\n        if self.is_available:\n            self.is_available = False\n            return True\n        return False\n\n    def return_vehicle(self):\n        self.is_available = True\n\n    def __str__(self):\n        status = "Available" if self.is_available else "Not Available"\n        return f"{self.name} (ID: {self.vehicle_id}, Price/Day: {self.price_per_day}, {status})"\n\n\n# ---------------- Rental Transaction ----------------\nclass RentalTransaction:\n    def __init__(self, customer_name, vehicle, days):\n        self.customer_name = customer_name\n        self.vehicle = vehicle\n        self.days = days\n        self.start_date = datetime.now()\n        self.end_date = self.start_date + timedelta(days=days)\n        self.total_cost = self.calculate_cost()\n\n    def calculate_cost(self):\n        return self.vehicle.price_per_day * self.days\n\n    def show_details(self):\n        print("\\n--- Rental Details ---")\n        print("Customer:", self.customer_name)\n        print("Vehicle:", self.vehicle.name)\n        print("Days:", self.days)\n        print("Start Date:", self.start_date.date())\n        print("End Date:", self.end_date.date())\n        print("Total Cost:", self.total_cost)\n\n\n# ---------------- Rental Agency ----------------\nclass RentalAgency:\n    def __init__(self, name):\n        self.name = name\n        self.vehicles = []\n        self.transactions = []\n\n    def add_vehicle(self, vehicle):\n        self.vehicles.append(vehicle)\n\n    def show_available_vehicles(self):\n        print("\\nAvailable Vehicles:")\n        for v in self.vehicles:\n            if v.is_available:\n                print(v)\n\n    def rent_vehicle(self, customer_name, vehicle_id, days):\n        for v in self.vehicles:\n            if v.vehicle_id == vehicle_id and v.is_available:\n                v.rent()\n                transaction = RentalTransaction(customer_name, v, days)\n                self.transactions.append(transaction)\n                print("\\nBooking Successful!")\n                transaction.show_details()\n                return transaction\n\n        print("Vehicle not available or invalid ID!")\n        return None\n\n    def return_vehicle(self, vehicle_id):\n        for v in self.vehicles:\n            if v.vehicle_id == vehicle_id:\n                v.return_vehicle()\n                print(f"Vehicle {v.name} returned successfully.")\n                return\n        print("Invalid vehicle ID!")\n\n\n# ---------------- Main Program ----------------\nprint("--- Vehicle Rental System ---")\n\nagency = RentalAgency("City Rentals")\n\n# Add vehicles\nagency.add_vehicle(Vehicle(1, "Car", 1500))\nagency.add_vehicle(Vehicle(2, "Bike", 500))\nagency.add_vehicle(Vehicle(3, "SUV", 2500))\n\n# Show available vehicles\nagency.show_available_vehicles()\n\n# Rent vehicles\nagency.rent_vehicle("Aarav", 1, 3)\nagency.rent_vehicle("Neha", 2, 2)\n\n# Show availability after booking\nagency.show_available_vehicles()\n\n# Return vehicle\nagency.return_vehicle(1)\n\n# Final availability\nagency.show_available_vehicles()\n',
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
    problemStatement: "Develop a graphical user interface (GUI) application.",
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
        difficulty: "Hard",
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
        referenceSolution: {
          python:
            '# GUI Application for Unit Conversion using Tkinter\n# Supports: Currency (Rupees to Dollars), Temperature (Celsius to Fahrenheit), Length (Inches to Feet)\n\nimport tkinter as tk\nfrom tkinter import ttk\n\n# Conversion functions\n\ndef convert():\n    try:\n        value = float(entry_value.get())\n        choice = combo.get()\n\n        if choice == "Rupees to Dollars":\n            result = value / 83  # Approx conversion rate\n            result_label.config(text=f"Result: {result:.2f} USD")\n\n        elif choice == "Celsius to Fahrenheit":\n            result = (value * 9/5) + 32\n            result_label.config(text=f"Result: {result:.2f} °F")\n\n        elif choice == "Inches to Feet":\n            result = value / 12\n            result_label.config(text=f"Result: {result:.2f} ft")\n\n        else:\n            result_label.config(text="Please select a conversion type")\n\n    except ValueError:\n        result_label.config(text="Invalid input! Please enter a number")\n\n\n# Create main window\nroot = tk.Tk()\nroot.title("Unit Converter")\nroot.geometry("350x250")\n\n# Input field\nentry_label = tk.Label(root, text="Enter Value:")\nentry_label.pack()\nentry_value = tk.Entry(root)\nentry_value.pack()\n\n# Dropdown menu\noptions = ["Rupees to Dollars", "Celsius to Fahrenheit", "Inches to Feet"]\ncombo = ttk.Combobox(root, values=options)\ncombo.set("Select Conversion")\ncombo.pack()\n\n# Convert button\nbutton = tk.Button(root, text="Convert", command=convert)\nbutton.pack(pady=10)\n\n# Result label\nresult_label = tk.Label(root, text="Result will be shown here")\nresult_label.pack()\n\n# Run application\nroot.mainloop()\n',
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
        difficulty: "Hard",
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
        referenceSolution: {
          python:
            '# GUI Application to calculate areas of geometric figures\n# Supports Circle, Rectangle, and Triangle using Tkinter\n\nimport tkinter as tk\nfrom tkinter import ttk\nimport math\n\n# Function to calculate area\ndef calculate_area():\n    try:\n        shape = combo.get()\n\n        if shape == "Circle":\n            r = float(entry1.get())\n            area = math.pi * r * r\n            result_label.config(text=f"Area of Circle: {area:.2f}")\n\n        elif shape == "Rectangle":\n            l = float(entry1.get())\n            w = float(entry2.get())\n            area = l * w\n            result_label.config(text=f"Area of Rectangle: {area:.2f}")\n\n        elif shape == "Triangle":\n            b = float(entry1.get())\n            h = float(entry2.get())\n            area = 0.5 * b * h\n            result_label.config(text=f"Area of Triangle: {area:.2f}")\n\n        else:\n            result_label.config(text="Please select a shape")\n\n    except ValueError:\n        result_label.config(text="Invalid input! Enter numeric values")\n\n\n# Main window\nroot = tk.Tk()\nroot.title("Area Calculator")\nroot.geometry("400x300")\n\n# Shape selection\nlabel = tk.Label(root, text="Select Shape:")\nlabel.pack()\n\ncombo = ttk.Combobox(root, values=["Circle", "Rectangle", "Triangle"])\ncombo.set("Select Shape")\ncombo.pack()\n\n# Input fields\nlabel1 = tk.Label(root, text="Value 1 (Radius / Length / Base):")\nlabel1.pack()\nentry1 = tk.Entry(root)\nentry1.pack()\n\nlabel2 = tk.Label(root, text="Value 2 (Width / Height - if applicable):")\nlabel2.pack()\nentry2 = tk.Entry(root)\nentry2.pack()\n\n# Button\nbtn = tk.Button(root, text="Calculate Area", command=calculate_area)\nbtn.pack(pady=10)\n\n# Result label\nresult_label = tk.Label(root, text="Result will appear here")\nresult_label.pack()\n\n# Run application\nroot.mainloop()\n',
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
        difficulty: "Hard",
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
        referenceSolution: {
          python:
            '# College Admission Registration Form using Tkinter GUI\n# Collects personal, educational, and contact information\n\nimport tkinter as tk\nfrom tkinter import messagebox\n\n# Function to submit form data\ndef submit_form():\n    name = entry_name.get()\n    email = entry_email.get()\n    phone = entry_phone.get()\n\n    branch = branch_var.get()\n\n    # Collect selected games\n    games = []\n    if cricket_var.get():\n        games.append("Cricket")\n    if football_var.get():\n        games.append("Football")\n    if chess_var.get():\n        games.append("Chess")\n\n    # Format output message\n    result = "--- Admission Form Details ---\\n"\n    result += f"Name: {name}\\n"\n    result += f"Email: {email}\\n"\n    result += f"Phone: {phone}\\n"\n    result += f"Branch: {branch}\\n"\n    result += f"Favorite Games: {\', \'.join(games) if games else \'None\'}\\n"\n\n    # Show result in popup\n    messagebox.showinfo("Form Submitted", result)\n\n\n# Create main window\nroot = tk.Tk()\nroot.title("College Admission Form")\nroot.geometry("400x450")\n\n# Name\ntk.Label(root, text="Full Name:").pack()\nentry_name = tk.Entry(root)\nentry_name.pack()\n\n# Email\ntk.Label(root, text="Email:").pack()\nentry_email = tk.Entry(root)\nentry_email.pack()\n\n# Phone\ntk.Label(root, text="Phone Number:").pack()\nentry_phone = tk.Entry(root)\nentry_phone.pack()\n\n# Branch selection (Radio Buttons)\ntk.Label(root, text="Select Branch:").pack()\nbranch_var = tk.StringVar()\n\nbranches = ["Computer Engineering", "Information Technology", "Mechanical", "Civil"]\n\nfor b in branches:\n    tk.Radiobutton(root, text=b, variable=branch_var, value=b).pack()\n\n# Games selection (Checkboxes)\ntk.Label(root, text="Select Favorite Games:").pack()\n\ncricket_var = tk.IntVar()\nfootball_var = tk.IntVar()\nchess_var = tk.IntVar()\n\ntk.Checkbutton(root, text="Cricket", variable=cricket_var).pack()\ntk.Checkbutton(root, text="Football", variable=football_var).pack()\ntk.Checkbutton(root, text="Chess", variable=chess_var).pack()\n\n# Submit Button\ntk.Button(root, text="Submit", command=submit_form).pack(pady=10)\n\n# Run GUI\nroot.mainloop()\n',
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
    problemStatement:
      "Effectively utilize regular expressions in Python for pattern matching, validation, and data extraction tasks,",
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
        difficulty: "Medium",
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
        referenceSolution: {
          python:
            '# Program to validate phone number and email ID using regular expressions\n# Demonstrates use of Python\'s re module for pattern matching\n\nimport re\n\n# Function to validate email\ndef validate_email(email):\n    # Basic email pattern: username@domain.extension\n    pattern = r\'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$\'\n    return re.match(pattern, email)\n\n# Function to validate phone number\ndef validate_phone(phone):\n    # Accepts 10-digit phone numbers (simple validation)\n    pattern = r\'^[0-9]{10}$\'\n    return re.match(pattern, phone)\n\n# Take user input\nemail = input("Enter your email ID: ")\nphone = input("Enter your phone number: ")\n\n# Validate email\nif validate_email(email):\n    print("Valid Email ID")\nelse:\n    print("Invalid Email ID")\n\n# Validate phone number\nif validate_phone(phone):\n    print("Valid Phone Number")\nelse:\n    print("Invalid Phone Number (must be 10 digits)")\n',
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
        difficulty: "Medium",
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
        referenceSolution: {
          python:
            "# Program to validate password strength using regular expressions\n# Criteria:\n# 1. At least 8 characters\n# 2. At least one uppercase letter\n# 3. At least one lowercase letter\n# 4. At least one digit\n# 5. At least one special character\n\nimport re\n\n# Function to validate password\ndef validate_password(password):\n    # Check length first\n    if len(password) < 8:\n        return False\n\n    # Regex patterns for required conditions\n    upper = re.search(r'[A-Z]', password)\n    lower = re.search(r'[a-z]', password)\n    digit = re.search(r'[0-9]', password)\n    special = re.search(r'[!@#$%^&*(),.?\":{}|<>]', password)\n\n    # Return True only if all conditions are satisfied\n    if upper and lower and digit and special:\n        return True\n\n    return False\n\n# Take input from user\npassword = input(\"Enter your password: \")\n\n# Validate password\nif validate_password(password):\n    print(\"Strong password ✔\")\nelse:\n    print(\"Weak password ❌ (Must be 8+ chars, include uppercase, lowercase, digit, special char)\")\n",
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
        difficulty: "Medium",
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
        referenceSolution: {
          python:
            "# Program to validate a URL using regular expressions\n# Checks protocol (http/https), domain name, and optional path\n\nimport re\n\n# Function to validate URL\ndef validate_url(url):\n    # Regex pattern for basic URL validation\n    pattern = r'^(https?:\\/\\/)' \\\n              r'([a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,}' \\\n              r'(\\/[^\\s]*)?$'\n\n    return re.match(pattern, url)\n\n# Take input from user\nurl = input(\"Enter a URL: \")\n\n# Validate URL\nif validate_url(url):\n    print(\"Valid URL\")\nelse:\n    print(\"Invalid URL!\")\n",
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
        difficulty: "Hard",
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
        referenceSolution: {
          python:
            '# Program to extract emails, phone numbers, and dates from a text file using regular expressions\n\nimport re\n\n# Take file name as input\nfile_name = input("Enter text file name: ")\n\n# Regular expression patterns\nemail_pattern = r\'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}\'\nphone_pattern = r\'\\b\\d{10}\\b\'  # 10-digit phone numbers\ndate_pattern = r\'\\b(0[1-9]|1[0-2])/(0[1-9]|[12][0-9]|3[01])/\\d{4}\\b\'  # MM/DD/YYYY\n\ntry:\n    # Read file content\n    with open(file_name, \'r\') as file:\n        data = file.read()\n\n    # Extract data using regex\n    emails = re.findall(email_pattern, data)\n    phones = re.findall(phone_pattern, data)\n    dates = re.findall(date_pattern, data)\n\n    # Display results\n    print("\\n--- Extracted Data ---")\n\n    print("\\nEmail Addresses:")\n    for email in emails:\n        print(email)\n\n    print("\\nPhone Numbers:")\n    for phone in phones:\n        print(phone)\n\n    print("\\nDates (MM/DD/YYYY):")\n    for date in dates:\n        # date_pattern returns tuples due to groups, so reconstruct full match\n        print(date[0] + "/" + date[1] + "/" + date[2])\n\nexcept FileNotFoundError:\n    print("Error: File not found.")\n',
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
    problemStatement:
      "Utilize the NumPy libraries for efficient numerical computing.",
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
        difficulty: "Medium",
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
        referenceSolution: {
          python:
            '# Program to demonstrate 1D, 2D, and 3D NumPy arrays\n# Includes reshaping, slicing, and indexing operations\n\nimport numpy as np\n\n# -------------------- 1D Array --------------------\narr_1d = np.array([1, 2, 3, 4, 5, 6])\nprint("1D Array:", arr_1d)\n\n# Indexing\nprint("Element at index 2:", arr_1d[2])\n\n# Slicing\nprint("Sliced Array [1:4]:", arr_1d[1:4])\n\n# Reshaping 1D -> 2D\narr_2d_from_1d = arr_1d.reshape(2, 3)\nprint("\\nReshaped to 2D (2x3):\\n", arr_2d_from_1d)\n\n# -------------------- 2D Array --------------------\narr_2d = np.array([[1, 2, 3],\n                   [4, 5, 6],\n                   [7, 8, 9]])\nprint("\\n2D Array:\\n", arr_2d)\n\n# Indexing\nprint("Element at (1,2):", arr_2d[1][2])\n\n# Slicing rows\nprint("Rows 0 to 1:\\n", arr_2d[0:2])\n\n# Slicing columns\nprint("First column:", arr_2d[:, 0])\n\n# -------------------- 3D Array --------------------\narr_3d = np.array([\n    [[1, 2], [3, 4]],\n    [[5, 6], [7, 8]]\n])\nprint("\\n3D Array:\\n", arr_3d)\n\n# Indexing in 3D\nprint("Element at [1][0][1]:", arr_3d[1][0][1])\n\n# Slicing 3D array\nprint("First block:\\n", arr_3d[0])\n\n# Reshaping 2D -> 1D\nflat = arr_2d.reshape(9)\nprint("\\nFlattened 2D Array:", flat)\n\n# End of program\n',
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
        difficulty: "Medium",
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
        referenceSolution: {
          python:
            '# Program to perform element-wise and vector operations using NumPy\n\nimport numpy as np\n\n# Create two arrays of same shape\narr1 = np.array([[1, 2, 3],\n                 [4, 5, 6]])\n\narr2 = np.array([[7, 8, 9],\n                 [10, 11, 12]])\n\nprint("Array 1:\\n", arr1)\nprint("\\nArray 2:\\n", arr2)\n\n# ---------------- Element-wise operations ----------------\nprint("\\nElement-wise Addition:\\n", arr1 + arr2)\nprint("Element-wise Subtraction:\\n", arr1 - arr2)\nprint("Element-wise Multiplication:\\n", arr1 * arr2)\nprint("Element-wise Division:\\n", arr1 / arr2)\n\n# ---------------- Vector operations ----------------\n# For dot product and cross product, use 1D vectors\nvec1 = np.array([1, 2, 3])\nvec2 = np.array([4, 5, 6])\n\nprint("\\nVector 1:", vec1)\nprint("Vector 2:", vec2)\n\n# Dot product\nprint("Dot Product:", np.dot(vec1, vec2))\n\n# Cross product\nprint("Cross Product:", np.cross(vec1, vec2))\n',
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
        difficulty: "Hard",
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
        referenceSolution: {
          python:
            '# Program to calculate mean, median, standard deviation, variance, and correlation coefficients\n# Using NumPy for statistical operations\n\nimport numpy as np\n\n# Input array (you can modify or take user input if needed)\ndata = np.array([10, 20, 30, 40, 50])\n\n# If correlation is needed, we use a second array\ndata2 = np.array([5, 15, 25, 35, 45])\n\n# Mean\nmean = np.mean(data)\n\n# Median\nmedian = np.median(data)\n\n# Standard Deviation\nstd_dev = np.std(data)\n\n# Variance\nvariance = np.var(data)\n\n# Correlation coefficient (between two datasets)\ncorr_matrix = np.corrcoef(data, data2)\ncorrelation = corr_matrix[0][1]\n\n# Display results\nprint("Data:", data)\nprint("Mean:", mean)\nprint("Median:", median)\nprint("Standard Deviation:", std_dev)\nprint("Variance:", variance)\nprint("Correlation Coefficient (with second dataset):", correlation)\n',
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
    problemStatement:
      "Effectively use the Pandas library for data manipulation and the Matplotlib library for data visualization.",
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
        difficulty: "Hard",
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
        referenceSolution: {
          python:
            "# COVID-19 Data Analysis using Pandas and Matplotlib\n# Includes loading CSV, cleaning data, aggregation, and visualization\n\nimport pandas as pd\nimport numpy as np\nimport matplotlib.pyplot as plt\n\n# -------------------- Load Dataset --------------------\nfile_name = input(\"Enter COVID-19 CSV file path: \")\ndf = pd.read_csv(file_name)\n\n# -------------------- Basic Exploration --------------------\nprint(\"\\nFirst 5 rows:\")\nprint(df.head())\n\nprint(\"\\nData Types:\")\nprint(df.dtypes)\n\nprint(\"\\nBasic Statistics:\")\nprint(df.describe(include='all'))\n\n# -------------------- Data Cleaning --------------------\n# Handle missing values\ndf = df.fillna(0)\n\n# Remove duplicates\ndf = df.drop_duplicates()\n\nprint(\"\\nAfter Cleaning:\")\nprint(df.info())\n\n# -------------------- Aggregation --------------------\n# Example: group by a 'Country' column (if present)\nif 'Country' in df.columns:\n    country_cases = df.groupby('Country').sum(numeric_only=True).iloc[:, 0]\n    print(\"\\nTop 5 Countries by cases:\")\n    print(country_cases.sort_values(ascending=False).head())\n\n# -------------------- Visualization --------------------\n\nplt.figure(figsize=(10,5))\n\n# Line Plot (trend over index or date if available)\nif 'Date' in df.columns and 'Confirmed' in df.columns:\n    df['Date'] = pd.to_datetime(df['Date'])\n    temp = df.groupby('Date')['Confirmed'].sum()\n    temp.plot(kind='line')\n    plt.title(\"COVID-19 Confirmed Cases Over Time\")\n    plt.xlabel(\"Date\")\n    plt.ylabel(\"Cases\")\n    plt.show()\n\n# Bar Plot\nif 'Country' in df.columns:\n    country_cases.sort_values(ascending=False).head(10).plot(kind='bar')\n    plt.title(\"Top 10 Countries by Cases\")\n    plt.xlabel(\"Country\")\n    plt.ylabel(\"Cases\")\n    plt.show()\n\n# Histogram\nnumeric_cols = df.select_dtypes(include=np.number).columns\nif len(numeric_cols) > 0:\n    df[numeric_cols[0]].plot(kind='hist', bins=20)\n    plt.title(\"Distribution\")\n    plt.show()\n\n# Scatter Plot (if at least 2 numeric columns exist)\nif len(numeric_cols) >= 2:\n    df.plot(kind='scatter', x=numeric_cols[0], y=numeric_cols[1])\n    plt.title(\"Scatter Plot\")\n    plt.show()\n",
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
        difficulty: "Hard",
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
        referenceSolution: {
          python:
            "# Iris Dataset Analysis using Pandas\n# Tasks: read first 8 rows, display columns, handle missing data, grouping, and statistics\n\nimport pandas as pd\nfrom sklearn.datasets import load_iris\n\n# Load Iris dataset\niris = load_iris()\n\n# Create DataFrame\ndf = pd.DataFrame(iris.data, columns=iris.feature_names)\n\n# Add species column\ndf['species'] = pd.Categorical.from_codes(iris.target, iris.target_names)\n\n# -------------------- Basic Display --------------------\nprint(\"First 8 rows:\")\nprint(df.head(8))\n\nprint(\"\\nColumn Names:\")\nprint(df.columns)\n\n# -------------------- Introduce & Handle Missing Values --------------------\n# (For demonstration, we artificially introduce missing values)\ndf.iloc[0, 0] = None\ndf.iloc[3, 1] = None\n\n# Fill missing values with column mean\ndf_filled = df.fillna(df.mean(numeric_only=True))\n\nprint(\"\\nAfter Filling Missing Values:\")\nprint(df_filled.head())\n\n# Remove rows with missing values (before fill)\ndf_dropped = df.dropna()\nprint(\"\\nAfter Dropping Missing Values (if any):\")\nprint(df_dropped.shape)\n\n# -------------------- Grouping by Species --------------------\nprint(\"\\nGrouped by Species:\")\ngrouped = df_filled.groupby('species')\nprint(grouped.mean(numeric_only=True))\n\n# -------------------- Sepal Length Statistics --------------------\nprint(\"\\nSepal Length Statistics by Species:\")\nsepal_stats = grouped['sepal length (cm)'].agg(['mean', 'min', 'max'])\nprint(sepal_stats)\n",
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
        difficulty: "Hard",
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
        referenceSolution: {
          python:
            '# Cars Dataset Visualization using Pandas & Matplotlib\n# Includes scatter, histogram, bar plot, pie chart, and box plot\n\nimport pandas as pd\nimport matplotlib.pyplot as plt\n\n# -------------------- Load Dataset --------------------\nfile_name = input("Enter Cars dataset CSV file path: ")\ndf = pd.read_csv(file_name)\n\n# Display first few rows\nprint("\\nFirst 5 rows:")\nprint(df.head())\n\n# Check column names\nprint("\\nColumns:")\nprint(df.columns)\n\n# -------------------- Data Cleaning --------------------\ndf = df.dropna()\n\n# -------------------- Scatter Plot: Age vs Price --------------------\nif \'Age\' in df.columns and \'Price\' in df.columns:\n    plt.figure()\n    plt.scatter(df[\'Age\'], df[\'Price\'])\n    plt.title("Age vs Price")\n    plt.xlabel("Age")\n    plt.ylabel("Price")\n    plt.show()\n\n# -------------------- Histogram: Kilometers Driven --------------------\nif \'Kilometers_Driven\' in df.columns:\n    plt.figure()\n    plt.hist(df[\'Kilometers_Driven\'], bins=20)\n    plt.title("Distribution of Kilometers Driven")\n    plt.xlabel("Kilometers Driven")\n    plt.ylabel("Frequency")\n    plt.show()\n\n# -------------------- Bar Plot: Fuel Type Distribution --------------------\nif \'Fuel_Type\' in df.columns:\n    fuel_counts = df[\'Fuel_Type\'].value_counts()\n\n    plt.figure()\n    fuel_counts.plot(kind=\'bar\')\n    plt.title("Fuel Type Distribution")\n    plt.xlabel("Fuel Type")\n    plt.ylabel("Count")\n    plt.show()\n\n    # -------------------- Pie Chart --------------------\n    plt.figure()\n    fuel_counts.plot(kind=\'pie\', autopct=\'%1.1f%%\')\n    plt.title("Fuel Type Percentage Distribution")\n    plt.ylabel("")\n    plt.show()\n\n# -------------------- Box Plot: Price by Fuel Type --------------------\nif \'Fuel_Type\' in df.columns and \'Price\' in df.columns:\n    plt.figure()\n    df.boxplot(column=\'Price\', by=\'Fuel_Type\')\n    plt.title("Price Distribution by Fuel Type")\n    plt.suptitle("")\n    plt.xlabel("Fuel Type")\n    plt.ylabel("Price")\n    plt.show()\n',
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
