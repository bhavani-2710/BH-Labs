require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const { Types: { ObjectId } } = mongoose;
const Subject = require('../models/Subject');
const Experiment = require('../models/Experiment');

const subjects = [
  {
    _id: new ObjectId("685b2a1f3c4e8d0012a7b004"),
    name: "Java Full Stack",
    code: "JAVA201",
    semester: 4,
    description: "Design and develop full stack applications using Java, Servlets, JSP, JDBC, HTML/CSS/JS, React, and Spring Boot."
  }
];

const experiments = [
  {
    _id: new ObjectId("685b2a1f3c4e8d0012a7b701"),
    subjectId: new ObjectId("685b2a1f3c4e8d0012a7b004"),
    experimentNumber: 1,
    title: "Programs on classes and objects",
    problemStatement: "Design and develop a Java application to demonstrate the concepts of classes and objects by creating user-defined classes, instantiating objects, and accessing data members and member functions using objects.",
    theory: "A class in Java is a template or blueprint from which objects are created. It contains fields (variables) and methods (functions) to describe the behavior of the object. An object is an instance of a class. Memory is allocated when an object is instantiated using the 'new' keyword.",
    algorithm: "1. Start\n2. Define a class Employee with members id, name, and salary.\n3. Define a method displayDetails() inside Employee to print the details.\n4. In the main class, instantiate an Employee object using new Employee().\n5. Set values for the employee's ID, Name, and Salary.\n6. Invoke displayDetails() on the instantiated object.\n7. Stop",
    difficulty: "Easy",
    subExperiments: [
      {
        part: "a",
        title: "Programs on classes and objects",
        problemStatement: "Design and develop a Java application to demonstrate the concepts of classes and objects by creating user-defined classes, instantiating objects, and accessing data members and member functions using objects.",
        theory: "A class in Java is a template or blueprint from which objects are created. It contains fields (variables) and methods (functions) to describe the behavior of the object. An object is an instance of a class. Memory is allocated when an object is instantiated using the 'new' keyword.",
        algorithm: "1. Start\n2. Define a class Employee with members id, name, and salary.\n3. Define a method displayDetails() inside Employee to print the details.\n4. In the main class, instantiate an Employee object using new Employee().\n5. Set values for the employee's ID, Name, and Salary.\n6. Invoke displayDetails() on the instantiated object.\n7. Stop",
        difficulty: "Easy",
        hints: [
          "Define a class using the 'class' keyword followed by the class name and a pair of curly braces.",
          "Use the 'new' keyword followed by the constructor name to instantiate an object from a class.",
          "Access object fields and methods using the dot operator (e.g., emp.name or emp.displayDetails()).",
          "Fields defined inside a class are called instance variables and are unique to each object.",
        ],
        flowchart: {
          nodes: [
            { id: "1", type: "start", label: "Start" },
            { id: "2", type: "process", label: "Define Employee class" },
            { id: "3", type: "process", label: "Instantiate Employee object in Main" },
            { id: "4", type: "process", label: "Set id, name, and salary fields" },
            { id: "5", type: "output", label: "Call displayDetails() to show properties" },
            { id: "6", type: "end", label: "Stop" }
          ],
          edges: [
            { source: "1", target: "2" },
            { source: "2", target: "3" },
            { source: "3", target: "4" },
            { source: "4", target: "5" },
            { source: "5", target: "6" }
          ]
        },
        referenceSolution: {
          java: `class Employee {
    int id;
    String name;
    double salary;

    void displayDetails() {
        System.out.println("Employee ID: " + id);
        System.out.println("Name: " + name);
        System.out.println("Salary: " + salary);
    }
}

public class Main {
    public static void main(String[] args) {
        Employee emp = new Employee();
        emp.id = 101;
        emp.name = "John Doe";
        emp.salary = 55000.0;
        emp.displayDetails();
    }
}`,
          javascript: `class Employee {
    constructor(id, name, salary) {
        this.id = id;
        this.name = name;
        this.salary = salary;
    }

    displayDetails() {
        console.log("Employee ID: " + this.id);
        console.log("Name: " + this.name);
        console.log("Salary: " + this.salary.toFixed(1));
    }
}

const emp = new Employee(101, "John Doe", 55000.0);
emp.displayDetails();`
        },
        samples: [
          {
            input: "",
            output: "Employee ID: 101\nName: John Doe\nSalary: 55000.0\n"
          }
        ]
      }
    ]
  },
  {
    _id: new ObjectId("685b2a1f3c4e8d0012a7b702"),
    subjectId: new ObjectId("685b2a1f3c4e8d0012a7b004"),
    experimentNumber: 2,
    title: "Programs on method and constructor overloading",
    problemStatement: "Design and develop a Java program to demonstrate compile-time polymorphism by implementing method overloading and constructor overloading with different parameter lists and displaying the corresponding outputs.",
    theory: "Method overloading allows a class to have more than one method with the same name if their parameter lists are different. Constructor overloading allows a class to have more than one constructor with different parameter lists. Compile-time polymorphism is achieved when the compiler binds the method call based on parameter count/types.",
    algorithm: "1. Start\n2. Create a class Box with overloaded constructors: default, one parameter (cube), and three parameters (rectangular box).\n3. Define overloaded methods area(): one for circle (one double parameter), and one for rectangle (two double parameters).\n4. In the main method, create instances of Box using different constructors and call the area() methods with different parameters.\n5. Display the volume and calculated area.\n6. Stop",
    difficulty: "Easy",
    subExperiments: [
      {
        part: "a",
        title: "Programs on method and constructor overloading",
        problemStatement: "Design and develop a Java program to demonstrate compile-time polymorphism by implementing method overloading and constructor overloading with different parameter lists and displaying the corresponding outputs.",
        theory: "Method overloading allows a class to have more than one method with the same name if their parameter lists are different. Constructor overloading allows a class to have more than one constructor with different parameter lists. Compile-time polymorphism is achieved when the compiler binds the method call based on parameter count/types.",
        algorithm: "1. Start\n2. Create a class Box with overloaded constructors: default, one parameter (cube), and three parameters (rectangular box).\n3. Define overloaded methods area(): one for circle (one double parameter), and one for rectangle (two double parameters).\n4. In the main method, create instances of Box using different constructors and call the area() methods with different parameters.\n5. Display the volume and calculated area.\n6. Stop",
        difficulty: "Easy",
        hints: [
          "Method overloading is achieved by defining multiple methods with the same name but different parameter types or counts.",
          "Constructor overloading allows initializing objects in different ways depending on the provided arguments.",
          "The compiler decides which overloaded version to invoke based on the argument list at compile time.",
          "You can overload the same method for a circle (1 arg: radius) and a rectangle (2 args: length, width).",
        ],
        flowchart: {
          nodes: [
            { id: "1", type: "start", label: "Start" },
            { id: "2", type: "process", label: "Define Box with overloaded constructors" },
            { id: "3", type: "process", label: "Define overloaded area methods in Main" },
            { id: "4", type: "process", label: "Instantiate Box using parameterized constructors" },
            { id: "5", type: "output", label: "Print Box volumes and calculated areas" },
            { id: "6", type: "end", label: "Stop" }
          ],
          edges: [
            { source: "1", target: "2" },
            { source: "2", target: "3" },
            { source: "3", target: "4" },
            { source: "4", target: "5" },
            { source: "5", target: "6" }
          ]
        },
        referenceSolution: {
          java: `class Box {
    double width, height, depth;

    Box() {
        width = height = depth = 0;
    }

    Box(double len) {
        width = height = depth = len;
    }

    Box(double w, double h, double d) {
        width = w;
        height = h;
        depth = d;
    }

    double volume() {
        return width * height * depth;
    }
}

public class Main {
    static double area(double r) {
        return Math.PI * r * r;
    }

    static double area(double l, double w) {
        return l * w;
    }

    public static void main(String[] args) {
        Box cube = new Box(5);
        Box box = new Box(2, 3, 4);
        System.out.println("Volume (Cube): " + cube.volume());
        System.out.println("Volume (Box): " + box.volume());
        System.out.println("Area (Circle): " + area(5));
        System.out.println("Area (Rectangle): " + area(4, 5));
    }
}`,
          javascript: `class Box {
    constructor(...args) {
        if (args.length === 1) {
            this.width = this.height = this.depth = args[0];
        } else if (args.length === 3) {
            this.width = args[0];
            this.height = args[1];
            this.depth = args[2];
        } else {
            this.width = this.height = this.depth = 0;
        }
    }
    volume() { return this.width * this.height * this.depth; }
}

function area(...args) {
    if (args.length === 1) return Math.PI * args[0] * args[0];
    if (args.length === 2) return args[0] * args[1];
    return 0;
}

const cube = new Box(5);
const box = new Box(2, 3, 4);
console.log("Volume (Cube): " + cube.volume().toFixed(1));
console.log("Volume (Box): " + box.volume().toFixed(1));
console.log("Area (Circle): " + area(5));
console.log("Area (Rectangle): " + area(4, 5).toFixed(1));`
        },
        samples: [
          {
            input: "",
            output: "Volume (Cube): 125.0\nVolume (Box): 120.0\nArea (Circle): 78.53981633974483\nArea (Rectangle): 20.0\n"
          }
        ]
      }
    ]
  },
  {
    _id: new ObjectId("685b2a1f3c4e8d0012a7b703"),
    subjectId: new ObjectId("685b2a1f3c4e8d0012a7b004"),
    experimentNumber: 3,
    title: "Programs on Various Types of Inheritance and Exception Handling",
    problemStatement: "Design and develop a Java application to demonstrate single, multilevel, and hierarchical inheritance along with exception handling mechanisms using try, catch, throw, throws, and finally blocks.",
    theory: "Inheritance is a mechanism in which one class acquires the properties of another. Java supports Single (A->B), Multilevel (A->B->C), and Hierarchical (A->B, A->C) inheritance. Exception handling processes runtime errors using try-catch blocks to prevent application crashes. finally block always executes.",
    algorithm: "1. Start\n2. Define parent class Person, child class Employee (Single), and grandchild class Manager (Multilevel).\n3. Write a method work() in Employee that throws an ArithmeticException under certain conditions.\n4. Wrap the method call in a try-catch block.\n5. Access parent variables to demonstrate inheritance.\n6. Handle exceptions in the catch block and run cleanups in finally.\n7. Stop",
    difficulty: "Medium",
    subExperiments: [
      {
        part: "a",
        title: "Programs on Various Types of Inheritance and Exception Handling",
        problemStatement: "Design and develop a Java application to demonstrate single, multilevel, and hierarchical inheritance along with exception handling mechanisms using try, catch, throw, throws, and finally blocks.",
        theory: "Inheritance is a mechanism in which one class acquires the properties of another. Java supports Single (A->B), Multilevel (A->B->C), and Hierarchical (A->B, A->C) inheritance. Exception handling processes runtime errors using try-catch blocks to prevent application crashes. finally block always executes.",
        algorithm: "1. Start\n2. Define parent class Person, child class Employee (Single), and grandchild class Manager (Multilevel).\n3. Write a method work() in Employee that throws an ArithmeticException under certain conditions.\n4. Wrap the method call in a try-catch block.\n5. Access parent variables to demonstrate inheritance.\n6. Handle exceptions in the catch block and run cleanups in finally.\n7. Stop",
        difficulty: "Medium",
        hints: [
          "Use the 'extends' keyword to create a subclass that inherits all non-private members of a parent class.",
          "Wrap risky code in a try block and catch specific exception types to handle runtime errors gracefully.",
          "The 'finally' block always executes regardless of whether an exception was thrown or caught.",
          "For multilevel inheritance, a grandchild class inherits members from both the parent and grandparent classes.",
        ],
        flowchart: {
          nodes: [
            { id: "1", type: "start", label: "Start" },
            { id: "2", type: "process", label: "Define inheritance chain: Person -> Employee -> Manager" },
            { id: "3", type: "process", label: "Run main and instantiate Manager" },
            { id: "4", type: "process", label: "Enter try-catch block and perform division by zero" },
            { id: "5", type: "output", label: "Catch ArithmeticException and print details" },
            { id: "6", type: "process", label: "Execute finally block" },
            { id: "7", type: "end", label: "Stop" }
          ],
          edges: [
            { source: "1", target: "2" },
            { source: "2", target: "3" },
            { source: "3", target: "4" },
            { source: "4", target: "5" },
            { source: "5", target: "6" },
            { source: "6", target: "7" }
          ]
        },
        referenceSolution: {
          java: `class Person {
    String name = "Alice";
}

class Employee extends Person {
    int id = 101;
}

class Manager extends Employee {
    String department = "Engineering";
}

public class Main {
    public static void main(String[] args) {
        try {
            Manager mgr = new Manager();
            System.out.println("Manager: " + mgr.name + " (" + mgr.id + ") in " + mgr.department);
            int result = 10 / 0;
        } catch (ArithmeticException e) {
            System.out.println("Exception: Division by zero");
        } finally {
            System.out.println("Finally block executed");
        }
    }
}`,
          javascript: `class Person { constructor() { this.name = "Alice"; } }
class Employee extends Person { constructor() { super(); this.id = 101; } }
class Manager extends Employee { constructor() { super(); this.department = "Engineering"; } }

try {
    const mgr = new Manager();
    console.log("Manager: " + mgr.name + " (" + mgr.id + ") in " + mgr.department);
    throw new Error("Division by zero");
} catch (e) {
    console.log("Exception: " + e.message);
} finally {
    console.log("Finally block executed");
}`
        },
        samples: [
          {
            input: "",
            output: "Manager: Alice (101) in Engineering\nException: Division by zero\nFinally block executed\n"
          }
        ]
      }
    ]
  },
  {
    _id: new ObjectId("685b2a1f3c4e8d0012a7b704"),
    subjectId: new ObjectId("685b2a1f3c4e8d0012a7b004"),
    experimentNumber: 4,
    title: "Program on Implementing Generic and HTTP Servlet",
    problemStatement: "Design and implement a Java application that demonstrates the use of generic classes and methods and develop an HTTP Servlet to process client requests and generate appropriate responses.",
    theory: "Generics allow types (classes and interfaces) to be parameters when defining classes, methods, and interfaces. Servlets are Java classes that run on a Java-enabled web server (like Tomcat) to handle HTTP client requests (GET, POST). HTTP Servlet extends HttpServlet and overrides doGet() or doPost().",
    algorithm: "1. Start\n2. Define a generic class Box<T> that stores an object of type T.\n3. Define a mock MyHttpServlet simulating request handling.\n4. Instantiate the generic box with Integer and String types.\n5. Implement a servlet handler printing an HTML response.\n6. Stop",
    difficulty: "Hard",
    subExperiments: [
      {
        part: "a",
        title: "Program on Implementing Generic and HTTP Servlet",
        problemStatement: "Design and implement a Java application that demonstrates the use of generic classes and methods and develop an HTTP Servlet to process client requests and generate appropriate responses.",
        theory: "Generics allow types (classes and interfaces) to be parameters when defining classes, methods, and interfaces. Servlets are Java classes that run on a Java-enabled web server (like Tomcat) to handle HTTP client requests (GET, POST). HTTP Servlet extends HttpServlet and overrides doGet() or doPost().",
        algorithm: "1. Start\n2. Define a generic class Box<T> that stores an object of type T.\n3. Define a mock MyHttpServlet simulating request handling.\n4. Instantiate the generic box with Integer and String types.\n5. Implement a servlet handler printing an HTML response.\n6. Stop",
        difficulty: "Hard",
        hints: [
          "Define a generic class using <T> as a type parameter, e.g. class Box<T> { private T t; }.",
          "Instantiate a generic class by providing the concrete type in angle brackets, e.g. Box<String> box = new Box<>();.",
          "An HTTP Servlet overrides doGet() or doPost() methods to handle browser requests.",
          "Use System.out.println to simulate HTTP response output in a standalone Java program.",
        ],
        flowchart: {
          nodes: [
            { id: "1", type: "start", label: "Start" },
            { id: "2", type: "process", label: "Define Generic class Box<T>" },
            { id: "3", type: "process", label: "Instantiate Box<String> in Main" },
            { id: "4", type: "output", label: "Output generic box contents" },
            { id: "5", type: "output", label: "Simulate HTTP Servlet Response printout" },
            { id: "6", type: "end", label: "Stop" }
          ],
          edges: [
            { source: "1", target: "2" },
            { source: "2", target: "3" },
            { source: "3", target: "4" },
            { source: "4", target: "5" },
            { source: "5", target: "6" }
          ]
        },
        referenceSolution: {
          java: `class Box<T> {
    private T t;
    public void set(T t) { this.t = t; }
    public T get() { return t; }
}

public class Main {
    public static void main(String[] args) {
        Box<String> box = new Box<>();
        box.set("Hello Servlets");
        System.out.println("Generic Box Content: " + box.get());
        System.out.println("HTTP Response: 200 OK");
        System.out.println("Content-Type: text/html");
        System.out.println("<h1>" + box.get() + "</h1>");
    }
}`,
          javascript: `class Box {
    constructor(val) { this.val = val; }
    set(val) { this.val = val; }
    get() { return this.val; }
}

const box = new Box("Hello Servlets");
console.log("Generic Box Content: " + box.get());
console.log("HTTP Response: 200 OK");
console.log("Content-Type: text/html");
console.log("<h1>" + box.get() + "</h1>");`
        },
        samples: [
          {
            input: "",
            output: "Generic Box Content: Hello Servlets\nHTTP Response: 200 OK\nContent-Type: text/html\n<h1>Hello Servlets</h1>\n"
          }
        ]
      }
    ]
  },
  {
    _id: new ObjectId("685b2a1f3c4e8d0012a7b705"),
    subjectId: new ObjectId("685b2a1f3c4e8d0012a7b004"),
    experimentNumber: 5,
    title: "Design a Login Webpage in JSP Using JDBC and Servlet",
    problemStatement: "Design and develop a login webpage using JSP that validates user credentials through a database using JDBC and invokes Servlets to perform various operations based on successful authentication.",
    theory: "A login system uses JSP for the frontend presentation, a Servlet for request controller logic, and JDBC to connect to a relational database (like MySQL) to validate credentials. DriverManager.getConnection() connects to the DB, and PreparedStatement runs parameterized SQL queries.",
    algorithm: "1. Start\n2. Define user input parameters: username and password.\n3. Load the JDBC Driver and establish a connection to jdbc:mysql://localhost:3306/db.\n4. Query the database: SELECT * FROM users WHERE username=? AND password=?.\n5. If a record is found, authentication is successful; redirect to dashboard.\n6. Else, redirect back to login page with an error.\n7. Stop",
    difficulty: "Hard",
    subExperiments: [
      {
        part: "a",
        title: "Design a Login Webpage in JSP Using JDBC and Servlet",
        problemStatement: "Design and develop a login webpage using JSP that validates user credentials through a database using JDBC and invokes Servlets to perform various operations based on successful authentication.",
        theory: "A login system uses JSP for the frontend presentation, a Servlet for request controller logic, and JDBC to connect to a relational database (like MySQL) to validate credentials. DriverManager.getConnection() connects to the DB, and PreparedStatement runs parameterized SQL queries.",
        algorithm: "1. Start\n2. Define user input parameters: username and password.\n3. Load the JDBC Driver and establish a connection to jdbc:mysql://localhost:3306/db.\n4. Query the database: SELECT * FROM users WHERE username=? AND password=?.\n5. If a record is found, authentication is successful; redirect to dashboard.\n6. Else, redirect back to login page with an error.\n7. Stop",
        difficulty: "Hard",
        hints: [
          "Simulate the JDBC validation logic using a simple string comparison (user.equals()) in a standalone program.",
          "In a real system, use Class.forName() to load the JDBC driver and DriverManager.getConnection() to connect to DB.",
          "Always use PreparedStatement instead of concatenating SQL strings to prevent SQL injection.",
          "Return true from the validate method when credentials match, and redirect to a dashboard or error page accordingly.",
        ],
        flowchart: {
          nodes: [
            { id: "1", type: "start", label: "Start" },
            { id: "2", type: "input", label: "Read user credentials" },
            { id: "3", type: "decision", label: "Credentials match admin / password123?" },
            { id: "4", type: "output", label: "Login Successful! Welcome admin" },
            { id: "5", type: "output", label: "Invalid Credentials" },
            { id: "6", type: "end", label: "Stop" }
          ],
          edges: [
            { source: "1", target: "2" },
            { source: "2", target: "3" },
            { source: "3", target: "4", label: "Yes" },
            { source: "3", target: "5", label: "No" },
            { source: "4", target: "6" },
            { source: "5", target: "6" }
          ]
        },
        referenceSolution: {
          java: `public class Main {
    public static boolean validate(String user, String pass) {
        return user.equals("admin") && pass.equals("password123");
    }
    public static void main(String[] args) {
        String user = "admin";
        String pass = "password123";
        if (validate(user, pass)) {
            System.out.println("Login Successful! Welcome " + user);
        } else {
            System.out.println("Invalid Credentials");
        }
    }
}`,
          javascript: `function validate(user, pass) {
    return user === "admin" && pass === "password123";
}

const user = "admin";
const pass = "password123";
if (validate(user, pass)) {
    console.log("Login Successful! Welcome " + user);
} else {
    console.log("Invalid Credentials");
}`
        },
        samples: [
          {
            input: "",
            output: "Login Successful! Welcome admin\n"
          }
        ]
      }
    ]
  },
  {
    _id: new ObjectId("685b2a1f3c4e8d0012a7b706"),
    subjectId: new ObjectId("685b2a1f3c4e8d0012a7b004"),
    experimentNumber: 6,
    title: "Program on Implicit and Explicit Objects in JSP",
    problemStatement: "Design and develop JSP pages to demonstrate the use of implicit objects and explicit objects for handling requests, responses, sessions, and application-level data in web applications.",
    theory: "JSP Implicit Objects are Java objects that the JSP Container makes available to developers on each page automatically (e.g. request, response, out, session, application, pageContext). Explicit objects are created by developers using bean tags (<jsp:useBean>) or standard instantiation.",
    algorithm: "1. Start\n2. Set session attribute using implicit object session.setAttribute(\"user\", \"John\").\n3. Retrieve session attribute using session.getAttribute(\"user\").\n4. Output a response using the implicit object out.println().\n5. Stop",
    difficulty: "Medium",
    subExperiments: [
      {
        part: "a",
        title: "Program on Implicit and Explicit Objects in JSP",
        problemStatement: "Design and develop JSP pages to demonstrate the use of implicit objects and explicit objects for handling requests, responses, sessions, and application-level data in web applications.",
        theory: "JSP Implicit Objects are Java objects that the JSP Container makes available to developers on each page automatically (e.g. request, response, out, session, application, pageContext). Explicit objects are created by developers using bean tags (<jsp:useBean>) or standard instantiation.",
        algorithm: "1. Start\n2. Set session attribute using implicit object session.setAttribute(\"user\", \"John\").\n3. Retrieve session attribute using session.getAttribute(\"user\").\n4. Output a response using the implicit object out.println().\n5. Stop",
        difficulty: "Medium",
        hints: [
          "In JSP, 'session' is an implicit object; simulate it in standalone Java using a HashMap or Map.",
          "Use session.setAttribute(key, value) to store data and session.getAttribute(key) to retrieve it.",
          "Implicit objects (request, response, session, out, application) are automatically available in JSP without declaration.",
          "Explicit objects are created using <jsp:useBean id='...' class='...' scope='session'/> or standard Java instantiation.",
        ],
        flowchart: {
          nodes: [
            { id: "1", type: "start", label: "Start" },
            { id: "2", type: "process", label: "Simulate session Map store" },
            { id: "3", type: "process", label: "Put user=JohnDoe in session map" },
            { id: "4", type: "output", label: "Retrieve key 'username' and display Welcome msg" },
            { id: "5", type: "end", label: "Stop" }
          ],
          edges: [
            { source: "1", target: "2" },
            { source: "2", target: "3" },
            { source: "3", target: "4" },
            { source: "4", target: "5" }
          ]
        },
        referenceSolution: {
          java: `import java.util.HashMap;
import java.util.Map;

public class Main {
    public static void main(String[] args) {
        Map<String, Object> session = new HashMap<>();
        session.put("username", "JohnDoe");
        System.out.println("Welcome " + session.get("username") + " (Session ID retrieved)");
    }
}`,
          javascript: `const session = new Map();
session.set("username", "JohnDoe");
console.log("Welcome " + session.get("username") + " (Session ID retrieved)");`
        },
        samples: [
          {
            input: "",
            output: "Welcome JohnDoe (Session ID retrieved)\n"
          }
        ]
      }
    ]
  },
  {
    _id: new ObjectId("685b2a1f3c4e8d0012a7b707"),
    subjectId: new ObjectId("685b2a1f3c4e8d0012a7b004"),
    experimentNumber: 7,
    title: "Program to Create a Website Using HTML, CSS and JavaScript",
    problemStatement: "Design and develop a responsive website using HTML, CSS, and JavaScript to demonstrate webpage structure, styling, and client-side interactivity.",
    theory: "HTML defines the content structure, CSS styles the visual layout (margins, colors, responsive flexbox/grid), and JavaScript provides behavior. Client-side DOM interaction allows developers to dynamically alter styles and respond to user clicks.",
    algorithm: "1. Start\n2. Define HTML skeleton containing a header, main, and footer.\n3. Add CSS for styling: color palettes, typography, responsive queries.\n4. Write JS to handle event listener clicks on a toggle button.\n5. Output a mockup representation of the website state.\n6. Stop",
    difficulty: "Medium",
    subExperiments: [
      {
        part: "a",
        title: "Program to Create a Website Using HTML, CSS and JavaScript",
        problemStatement: "Design and develop a responsive website using HTML, CSS, and JavaScript to demonstrate webpage structure, styling, and client-side interactivity.",
        theory: "HTML defines the content structure, CSS styles the visual layout (margins, colors, responsive flexbox/grid), and JavaScript provides behavior. Client-side DOM interaction allows developers to dynamically alter styles and respond to user clicks.",
        algorithm: "1. Start\n2. Define HTML skeleton containing a header, main, and footer.\n3. Add CSS for styling: color palettes, typography, responsive queries.\n4. Write JS to handle event listener clicks on a toggle button.\n5. Output a mockup representation of the website state.\n6. Stop",
        difficulty: "Medium",
        hints: [
          "HTML defines structure using semantic tags like <header>, <main>, <section>, and <footer>.",
          "Use CSS selectors (class, ID, element) to apply styling rules to HTML elements.",
          "Use JavaScript addEventListener('click', callback) to respond to user interactions.",
          "Simulate the page/DOM behavior in a console program by printing what actions would occur.",
        ],
        flowchart: {
          nodes: [
            { id: "1", type: "start", label: "Start" },
            { id: "2", type: "output", label: "Load HTML structure string" },
            { id: "3", type: "output", label: "Apply CSS styles" },
            { id: "4", type: "output", label: "Trigger click event simulation" },
            { id: "5", type: "end", label: "Stop" }
          ],
          edges: [
            { source: "1", target: "2" },
            { source: "2", target: "3" },
            { source: "3", target: "4" },
            { source: "4", target: "5" }
          ]
        },
        referenceSolution: {
          java: `public class Main {
    public static void main(String[] args) {
        System.out.println("--- HTML/CSS/JS Website Structure ---");
        System.out.println("<html>\n<head>\n<style>body { background-color: lightblue; }</style>\n</head>");
        System.out.println("<body>\n<h1>Welcome to Full Stack Web Development</h1>\n</body>\n</html>");
    }
}`,
          javascript: `function loadWebsite() {
    console.log("--- HTML/CSS/JS Website Structure ---");
    console.log("<html>\n<head>\n<style>body { background-color: lightblue; }</style>\n</head>");
    console.log("<body>\n<h1>Welcome to Full Stack Web Development</h1>\n</body>\n</html>");
}
loadWebsite();`
        },
        samples: [
          {
            input: "",
            output: "HTML Structure Loaded.\nCSS Stylesheet Applied.\nButton clicked: Color toggled!\n"
          }
        ]
      }
    ]
  },
  {
    _id: new ObjectId("685b2a1f3c4e8d0012a7b708"),
    subjectId: new ObjectId("685b2a1f3c4e8d0012a7b004"),
    experimentNumber: 8,
    title: "JavaScript Program for Email Validation",
    problemStatement: "Design and develop a JavaScript program to validate an email address entered by the user by checking the presence of '@' and '.' characters and display an alert message if the email format is invalid.",
    theory: "JavaScript string methods indexOf() can search for indices of characters. Email validation requires @ to be present and not as the first character, and a dot . to be present after the @ symbol with at least one character in between.",
    algorithm: "1. Start\n2. Read email string email.\n3. Find index of @ (atPos) and . (dotPos).\n4. If atPos < 1 or dotPos < atPos + 2 or dotPos + 2 >= email.length: output 'Invalid Email'.\n5. Else: output 'Valid Email'.\n6. Stop",
    difficulty: "Easy",
    subExperiments: [
      {
        part: "a",
        title: "JavaScript Program for Email Validation",
        problemStatement: "Design and develop a JavaScript program to validate an email address entered by the user by checking the presence of '@' and '.' characters and display an alert message if the email format is invalid.",
        theory: "JavaScript string methods indexOf() can search for indices of characters. Email validation requires @ to be present and not as the first character, and a dot . to be present after the @ symbol with at least one character in between.",
        algorithm: "1. Start\n2. Read email string email.\n3. Find index of @ (atPos) and . (dotPos).\n4. If atPos < 1 or dotPos < atPos + 2 or dotPos + 2 >= email.length: output 'Invalid Email'.\n5. Else: output 'Valid Email'.\n6. Stop",
        difficulty: "Easy",
        hints: [
          "Use String.includes('@') or String.indexOf('@') to check for the presence of the '@' symbol.",
          "A valid email must have '@' somewhere in the middle and a '.' after the '@' sign.",
          "In Java, use email.contains('@') and email.contains('.') for basic validation.",
          "For stricter validation, use a regular expression pattern like '[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+'.",
        ],
        flowchart: {
          nodes: [
            { id: "1", type: "start", label: "Start" },
            { id: "2", type: "input", label: "Read email address string" },
            { id: "3", type: "process", label: "Find index of @ and dot" },
            { id: "4", type: "decision", label: "Valid positions?" },
            { id: "5", type: "output", label: "Print Valid Email" },
            { id: "6", type: "output", label: "Print Invalid Email" },
            { id: "7", type: "end", label: "Stop" }
          ],
          edges: [
            { source: "1", target: "2" },
            { source: "2", target: "3" },
            { source: "3", target: "4" },
            { source: "4", target: "5", label: "Yes" },
            { source: "4", target: "6", label: "No" },
            { source: "5", target: "7" },
            { source: "6", target: "7" }
          ]
        },
        referenceSolution: {
          java: `public class Main {
    public static boolean validateEmail(String email) {
        return email.contains("@") && email.contains(".");
    }
    public static void main(String[] args) {
        String email = "test@example.com";
        if (validateEmail(email)) {
            System.out.println(email + " is Valid");
        } else {
            System.out.println(email + " is Invalid");
        }
    }
}`,
          javascript: `function validateEmail(email) {
    return email.includes("@") && email.includes(".");
}

const email = "test@example.com";
if (validateEmail(email)) {
    console.log(email + " is Valid");
} else {
    console.log(email + " is Invalid");
}`
        },
        samples: [
          {
            input: "",
            output: "test@example.com is Valid\n"
          }
        ]
      }
    ]
  },
  {
    _id: new ObjectId("685b2a1f3c4e8d0012a7b709"),
    subjectId: new ObjectId("685b2a1f3c4e8d0012a7b004"),
    experimentNumber: 9,
    title: "DOM Program to Change Background Color Automatically",
    problemStatement: "Design and develop a JavaScript program using the Document Object Model (DOM) to automatically change the background color of a webpage at regular intervals of five seconds.",
    theory: "The Document Object Model (DOM) permits JavaScript to manipulate HTML documents dynamically. document.body.style.backgroundColor sets background color. setInterval(function, time_ms) executes a callback repeatedly after a specified time delay.",
    algorithm: "1. Start\n2. Define an array of colors: [\"red\", \"blue\", \"green\", \"yellow\", \"purple\"].\n3. Keep a index counter currentIndex = 0.\n4. Use setInterval to run a function every 5000ms.\n5. Inside function: set background color to colors[currentIndex] and increment currentIndex modulo colors length.\n6. Stop",
    difficulty: "Easy",
    subExperiments: [
      {
        part: "a",
        title: "DOM Program to Change Background Color Automatically",
        problemStatement: "Design and develop a JavaScript program using the Document Object Model (DOM) to automatically change the background color of a webpage at regular intervals of five seconds.",
        theory: "The Document Object Model (DOM) permits JavaScript to manipulate HTML documents dynamically. document.body.style.backgroundColor sets background color. setInterval(function, time_ms) executes a callback repeatedly after a specified time delay.",
        algorithm: "1. Start\n2. Define an array of colors: [\"red\", \"blue\", \"green\", \"yellow\", \"purple\"].\n3. Keep a index counter currentIndex = 0.\n4. Use setInterval to run a function every 5000ms.\n5. Inside function: set background color to colors[currentIndex] and increment currentIndex modulo colors length.\n6. Stop",
        difficulty: "Easy",
        hints: [
          "Store the list of colors in an array and cycle through them using an index variable.",
          "Use the modulo operator (%) with the array length to wrap the index around to 0 after the last color.",
          "In a browser environment, assign document.body.style.backgroundColor = colors[index] inside a setInterval callback.",
          "Simulate the color rotation in console output by calling the change function manually a few times.",
        ],
        flowchart: {
          nodes: [
            { id: "1", type: "start", label: "Start" },
            { id: "2", type: "process", label: "Initialize colors list and index" },
            { id: "3", type: "process", label: "Execute changeColor function" },
            { id: "4", type: "output", label: "Set body background color to colors[index]" },
            { id: "5", type: "process", label: "Increment index modulo color size" },
            { id: "6", type: "end", label: "Stop" }
          ],
          edges: [
            { source: "1", target: "2" },
            { source: "2", target: "3" },
            { source: "3", target: "4" },
            { source: "4", target: "5" },
            { source: "5", target: "6" }
          ]
        },
        referenceSolution: {
          java: `public class Main {
    public static void main(String[] args) {
        String[] colors = {"red", "blue", "green", "yellow", "purple"};
        System.out.println("Rotated background to: " + colors[1]);
        System.out.println("Rotated background to: " + colors[2]);
    }
}`,
          javascript: `const colors = ["red", "blue", "green", "yellow", "purple"];
let currentIndex = 0;

function changeColorSimulated() {
    currentIndex = (currentIndex + 1) % colors.length;
    console.log("Rotated background to: " + colors[currentIndex]);
}

changeColorSimulated();
changeColorSimulated();`
        },
        samples: [
          {
            input: "",
            output: "Background color changed to: red\nBackground color changed to: blue\n"
          }
        ]
      }
    ]
  },
  {
    _id: new ObjectId("685b2a1f3c4e8d0012a7b70a"),
    subjectId: new ObjectId("685b2a1f3c4e8d0012a7b004"),
    experimentNumber: 10,
    title: "React Hooks Program for Color Selection",
    problemStatement: "Design and develop a React application using Hooks that displays four buttons namely Red, Blue, Green, and Yellow, and displays an appropriate message indicating the selected color when the corresponding button is clicked.",
    theory: "React Hooks (like useState) allow functional components to store state values. When state changes, React re-renders the component dynamically. This enables interactive and responsive web components without direct DOM manipulation.",
    algorithm: "1. Start\n2. Define a React component.\n3. Initialize state: const [color, setColor] = useState('').\n4. Render 4 buttons: Red, Blue, Green, Yellow.\n5. Add onClick handlers that trigger setColor('Red'), etc.\n6. Render a text paragraph showing 'Selected Color: ' + color.\n7. Stop",
    difficulty: "Medium",
    subExperiments: [
      {
        part: "a",
        title: "React Hooks Program for Color Selection",
        problemStatement: "Design and develop a React application using Hooks that displays four buttons namely Red, Blue, Green, and Yellow, and displays an appropriate message indicating the selected color when the corresponding button is clicked.",
        theory: "React Hooks (like useState) allow functional components to store state values. When state changes, React re-renders the component dynamically. This enables interactive and responsive web components without direct DOM manipulation.",
        algorithm: "1. Start\n2. Define a React component.\n3. Initialize state: const [color, setColor] = useState('').\n4. Render 4 buttons: Red, Blue, Green, Yellow.\n5. Add onClick handlers that trigger setColor('Red'), etc.\n6. Render a text paragraph showing 'Selected Color: ' + color.\n7. Stop",
        difficulty: "Medium",
        hints: [
          "Import useState from 'react' and initialize it with an empty string for the selected color.",
          "Each button's onClick handler should call setColor('Red') (or whichever color corresponds to that button).",
          "React automatically re-renders the component when state changes, updating the displayed color message.",
          "In a simulated console program, manually call the setter function and print the resulting selected color.",
        ],
        flowchart: {
          nodes: [
            { id: "1", type: "start", label: "Start" },
            { id: "2", type: "process", label: "Initialize selectedColor state hook" },
            { id: "3", type: "output", label: "Render layout and 4 action buttons" },
            { id: "4", type: "process", label: "Click Blue button to fire setter" },
            { id: "5", type: "output", label: "Display 'You have selected: Blue'" },
            { id: "6", type: "end", label: "Stop" }
          ],
          edges: [
            { source: "1", target: "2" },
            { source: "2", target: "3" },
            { source: "3", target: "4" },
            { source: "4", target: "5" },
            { source: "5", target: "6" }
          ]
        },
        referenceSolution: {
          java: `public class Main {
    public static void main(String[] args) {
        System.out.println("React State Simulator");
        System.out.println("Color selected: Red");
        System.out.println("Color selected: Blue");
    }
}`,
          javascript: `import React, { useState } from 'react';

function ColorSelector() {
    const [selectedColor, setSelectedColor] = useState("");

    return (
        <div>
            <h2>React Color Selector</h2>
            <button onClick={() => setSelectedColor("Red")}>Red</button>
            <button onClick={() => setSelectedColor("Blue")}>Blue</button>
            <button onClick={() => setSelectedColor("Green")}>Green</button>
            <button onClick={() => setSelectedColor("Yellow")}>Yellow</button>
            <p>You have selected: {selectedColor}</p>
        </div>
    );
}

console.log("React Component Rendered.");`
        },
        samples: [
          {
            input: "",
            output: "React Component Rendered.\n"
          }
        ]
      }
    ]
  },
  {
    _id: new ObjectId("685b2a1f3c4e8d0012a7b70b"),
    subjectId: new ObjectId("685b2a1f3c4e8d0012a7b004"),
    experimentNumber: 11,
    title: "Single Page Website Using React",
    problemStatement: "Design and develop a Single Page Application (SPA) using React by implementing concepts such as Hooks, Router, Props, and States to provide dynamic navigation and interactive user interfaces.",
    theory: "React SPAs load a single HTML page and dynamically update the DOM as the user interacts. Routing is managed client-side using react-router-dom (routes, components). State and props pass information between pages without full browser page reloads.",
    algorithm: "1. Start\n2. Set up React Router with routes for Home, About, and Contact.\n3. Render a Navigation bar containing links.\n4. Maintain active page route state in the router.\n5. Pass page data as props to custom components.\n6. Stop",
    difficulty: "Medium",
    subExperiments: [
      {
        part: "a",
        title: "Single Page Website Using React",
        problemStatement: "Design and develop a Single Page Application (SPA) using React by implementing concepts such as Hooks, Router, Props, and States to provide dynamic navigation and interactive user interfaces.",
        theory: "React SPAs load a single HTML page and dynamically update the DOM as the user interacts. Routing is managed client-side using react-router-dom (routes, components). State and props pass information between pages without full browser page reloads.",
        algorithm: "1. Start\n2. Set up React Router with routes for Home, About, and Contact.\n3. Render a Navigation bar containing links.\n4. Maintain active page route state in the router.\n5. Pass page data as props to custom components.\n6. Stop",
        difficulty: "Medium",
        hints: [
          "Use react-router-dom's BrowserRouter, Routes, and Route components to define client-side navigation paths.",
          "Props are read-only data passed from parent to child components using JSX attributes.",
          "useState manages active page or user data within a component; useEffect can handle side effects on mount.",
          "Simulate the routing behavior in console output by printing navigated route names when functions are called.",
        ],
        flowchart: {
          nodes: [
            { id: "1", type: "start", label: "Start" },
            { id: "2", type: "process", label: "Initialize React SPA application route container" },
            { id: "3", type: "process", label: "Create Navbar with Home/About click triggers" },
            { id: "4", type: "output", label: "Fire client routing changes and update viewport" },
            { id: "5", type: "end", label: "Stop" }
          ],
          edges: [
            { source: "1", target: "2" },
            { source: "2", target: "3" },
            { source: "3", target: "4" },
            { source: "4", target: "5" }
          ]
        },
        referenceSolution: {
          java: `public class Main {
    public static void main(String[] args) {
        System.out.println("React SPA Initialized.");
        System.out.println("Navigated to: home");
        System.out.println("Navigated to: about");
    }
}`,
          javascript: `import React from 'react';

function Navbar({ onNavigate }) {
    return (
        <nav>
            <button onClick={() => onNavigate("home")}>Home</button>
            <button onClick={() => onNavigate("about")}>About</button>
        </nav>
    );
}

function App() {
    console.log("React SPA Initialized.");
    Navbar({ onNavigate: (page) => console.log("Navigated to: " + page) });
}
App();`
        },
        samples: [
          {
            input: "",
            output: "React SPA Initialized.\nNavigated to: home\n"
          }
        ]
      }
    ]
  },
  {
    _id: new ObjectId("685b2a1f3c4e8d0012a7b70c"),
    subjectId: new ObjectId("685b2a1f3c4e8d0012a7b004"),
    experimentNumber: 12,
    title: "Monolithic Application Using Spring Boot",
    problemStatement: "Design and develop a monolithic web application using Spring Boot by integrating presentation, business, and data access layers within a single deployable unit.",
    theory: "A monolithic architecture combines user interface (Thymeleaf/HTML), business logic, and databases into a single system. Spring Boot provides dependency injection, automatic configurations, and embedded Tomcat to launch web apps instantly.",
    algorithm: "1. Start\n2. Create a Spring Boot application.\n3. Define a model Product, repository class ProductRepository extending JPA, and controller ProductController.\n4. Implement HTTP GET endpoints to render products list to a Thymeleaf HTML page.\n5. Run the Spring Boot application on port 8080.\n6. Stop",
    difficulty: "Hard",
    subExperiments: [
      {
        part: "a",
        title: "Monolithic Application Using Spring Boot",
        problemStatement: "Design and develop a monolithic web application using Spring Boot by integrating presentation, business, and data access layers within a single deployable unit.",
        theory: "A monolithic architecture combines user interface (Thymeleaf/HTML), business logic, and databases into a single system. Spring Boot provides dependency injection, automatic configurations, and embedded Tomcat to launch web apps instantly.",
        algorithm: "1. Start\n2. Create a Spring Boot application.\n3. Define a model Product, repository class ProductRepository extending JPA, and controller ProductController.\n4. Implement HTTP GET endpoints to render products list to a Thymeleaf HTML page.\n5. Run the Spring Boot application on port 8080.\n6. Stop",
        difficulty: "Hard",
        hints: [
          "Annotate the main class with @SpringBootApplication and call SpringApplication.run() to start the embedded server.",
          "Use @Entity to annotate a model class and @Repository or JpaRepository to handle data persistence.",
          "A @RestController class handles HTTP requests; use @GetMapping to map URL paths to methods.",
          "Simulate the behavior in a standalone program by instantiating the model directly and printing its properties.",
        ],
        flowchart: {
          nodes: [
            { id: "1", type: "start", label: "Start" },
            { id: "2", type: "process", label: "Define Product model properties" },
            { id: "3", type: "process", label: "Run main class to launch Embedded Tomcat" },
            { id: "4", type: "output", label: "Output product metadata retrieved from JPA repository" },
            { id: "5", type: "end", label: "Stop" }
          ],
          edges: [
            { source: "1", target: "2" },
            { source: "2", target: "3" },
            { source: "3", target: "4" },
            { source: "4", target: "5" }
          ]
        },
        referenceSolution: {
          java: `class Product {
    private int id;
    private String name;

    public Product(int id, String name) {
        this.id = id;
        this.name = name;
    }
    public String getName() { return name; }
}

public class Main {
    public static void main(String[] args) {
        System.out.println("Spring Boot Monolithic App started on port 8080");
        Product p = new Product(1, "Laptop");
        System.out.println("Fetched product from DB: " + p.getName());
    }
}`,
          javascript: `class Product {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
    getName() { return this.name; }
}

console.log("Spring Boot Monolithic App started on port 8080");
const p = new Product(1, "Laptop");
console.log("Fetched product from DB: " + p.getName());`
        },
        samples: [
          {
            input: "",
            output: "Spring Boot Monolithic App started on port 8080\nFetched product from DB: Laptop\n"
          }
        ]
      }
    ]
  },
  {
    _id: new ObjectId("685b2a1f3c4e8d0012a7b70d"),
    subjectId: new ObjectId("685b2a1f3c4e8d0012a7b004"),
    experimentNumber: 13,
    title: "Building RESTful APIs with Spring Boot",
    problemStatement: "Design and develop RESTful APIs using Spring Boot to perform Create, Read, Update, and Delete (CRUD) operations and exchange data between client and server using HTTP methods and JSON format.",
    theory: "RESTful APIs expose web resources as URLs. Spring Boot uses annotations like @RestController, @GetMapping, @PostMapping, @PutMapping, and @DeleteMapping to map HTTP requests to Java methods, converting objects to JSON automatically.",
    algorithm: "1. Start\n2. Create a RestController UserRestController.\n3. Implement @GetMapping(\"/api/users\") to return a list of users.\n4. Implement @PostMapping(\"/api/users\") to accept JSON body and create a user.\n5. Return appropriate HTTP response statuses (e.g. 200 OK, 201 Created).\n6. Stop",
    difficulty: "Hard",
    subExperiments: [
      {
        part: "a",
        title: "Building RESTful APIs with Spring Boot",
        problemStatement: "Design and develop RESTful APIs using Spring Boot to perform Create, Read, Update, and Delete (CRUD) operations and exchange data between client and server using HTTP methods and JSON format.",
        theory: "RESTful APIs expose web resources as URLs. Spring Boot uses annotations like @RestController, @GetMapping, @PostMapping, @PutMapping, and @DeleteMapping to map HTTP requests to Java methods, converting objects to JSON automatically.",
        algorithm: "1. Start\n2. Create a RestController UserRestController.\n3. Implement @GetMapping(\"/api/users\") to return a list of users.\n4. Implement @PostMapping(\"/api/users\") to accept JSON body and create a user.\n5. Return appropriate HTTP response statuses (e.g. 200 OK, 201 Created).\n6. Stop",
        difficulty: "Hard",
        hints: [
          "Annotate your controller class with @RestController and map endpoints using @GetMapping, @PostMapping, etc.",
          "Return Java objects from controller methods — Spring automatically serializes them to JSON using Jackson.",
          "Use @RequestBody to bind incoming JSON request body to a Java object in @PostMapping methods.",
          "Simulate REST behavior in a standalone Java program by printing the JSON-formatted response string.",
        ],
        flowchart: {
          nodes: [
            { id: "1", type: "start", label: "Start" },
            { id: "2", type: "process", label: "Define REST controller mappings" },
            { id: "3", type: "output", label: "Execute GET query and return User details as JSON" },
            { id: "4", type: "end", label: "Stop" }
          ],
          edges: [
            { source: "1", target: "2" },
            { source: "2", target: "3" },
            { source: "3", target: "4" }
          ]
        },
        referenceSolution: {
          java: `public class Main {
    public static void main(String[] args) {
        System.out.println("REST API Controller active: /api/users");
        System.out.println("GET /api/users -> Response: [{\"id\":1,\"name\":\"Alice\"}]");
    }
}`,
          javascript: `console.log("REST API Controller active: /api/users");
console.log('GET /api/users -> Response: [{"id":1,"name":"Alice"}]');`
        },
        samples: [
          {
            input: "",
            output: "REST API Controller active: /api/users\nGET /api/users -> Response: [{\"id\":1,\"name\":\"Alice\"}]\n"
          }
        ]
      }
    ]
  }
];

const seedDB = async () => {
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/bh_labs";
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB for Java seeding...");

    // Remove existing Java Full Stack subject and experiments
    await Subject.deleteMany({ name: "Java Full Stack" });
    await Experiment.deleteMany({ subjectId: new ObjectId("685b2a1f3c4e8d0012a7b004") });
    console.log("Cleared existing Java Full Stack data.");

    await Subject.insertMany(subjects);
    console.log(`Seeded ${subjects.length} subject(s).`);

    await Experiment.insertMany(experiments);
    console.log(`Seeded ${experiments.length} Java Full Stack experiment(s).`);

    console.log("Java seed completed successfully!");
  } catch (err) {
    console.error("Seeding error:", err);
  } finally {
    await mongoose.connection.close();
    console.log("Connection closed.");
  }
};

seedDB();
