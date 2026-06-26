import mongoose from "mongoose";
import Subject from "./models/Subject.js";
import Experiment from "./models/Experiment.js";

const subjectsData = [
  {
    name: "C Programming",
    code: "CS101",
    semester: 1,
    description: "Learn the fundamentals of procedural programming, memory management, and structured coding using C.",
  },
  {
    name: "Python Programming",
    code: "CS102",
    semester: 1,
    description: "Master clean script writing, powerful built-in data structures, and algorithmic logic in Python.",
  },
];

const experimentsData = [
  // C Programming Experiments
  {
    subjectCode: "CS101",
    experimentNumber: 1,
    title: "Hello World",
    problemStatement: "Write a C program to print 'Hello, World!' to the console.",
    theory: "In C, the main() function is the entry point of the application. The printf() function is defined in the standard input-output header (stdio.h) and is used to write formatted output to the console.",
    algorithm: "1. Include the stdio.h library.\n2. Define the main function returning an integer.\n3. Call printf(\"Hello World\\n\").\n4. Return 0 to indicate successful termination of the program.",
    difficulty: "Easy",
    concepts: ["Basic Syntax", "Output stream", "Main Function"],
    hints: [
      "Remember to include the standard I/O library at the very top using '#include <stdio.h>'.",
      "Use the 'printf' function to print the text 'Hello World'.",
      "Ensure your main function returns 0 and is closed properly with curly braces.",
    ],
    starterCode: `#include<stdio.h>
int main() {
    // Write your code here
    return 0;
}`,
    sampleInput: "No Input",
    sampleOutput: "Hello World",
    vivaQuestions: [
      {
        question: "What is the purpose of #include <stdio.h> in C?",
        answer: "It is a preprocessor directive that tells the compiler to include the Standard Input Output header file, which contains definitions for functions like printf() and scanf().",
      },
      {
        question: "What does the 'int' before the main function signify?",
        answer: "It indicates that the main function returns an integer value to the operating system upon completion. Typically, returning 0 signifies successful execution.",
      },
    ],
  },
  {
    subjectCode: "CS101",
    experimentNumber: 2,
    title: "Reverse String",
    problemStatement: "Write a program to reverse a given string in C.",
    theory: "A string in C is represented as an array of characters ending with a null character '\\0'. Reversing a string involves swapping characters starting from the outer boundary (start and end) and moving towards the center.",
    algorithm: "1. Declare a character array to store the string.\n2. Find the length of the string using strlen().\n3. Initialize two pointers or indices: 'start = 0' and 'end = length - 1'.\n4. Loop while start < end, swapping the characters at these indices using a temporary variable.\n5. Increment start and decrement end in each iteration.\n6. Print the reversed string.",
    difficulty: "Medium",
    concepts: ["Strings", "Loops", "Swapping", "Arrays"],
    hints: [
      "You can find the length of the string using the 'strlen()' function from the <string.h> header.",
      "Use a temporary 'char' variable to hold one character while swapping: temp = str[start]; str[start] = str[end]; str[end] = temp;",
      "Run your swapping loop only until the start index is less than the end index.",
    ],
    starterCode: `#include<stdio.h>
#include<string.h>

int main() {
    char str[100] = "hello";
    int len = strlen(str);
    int start = 0;
    int end = len - 1;
    char temp;

    // Write swapping logic here

    printf("Reversed string: %s\\n", str);
    return 0;
}`,
    sampleInput: "hello",
    sampleOutput: "olleh",
    vivaQuestions: [
      {
        question: "What is a string in C and how does it terminate?",
        answer: "A string in C is a sequence of characters stored in a contiguous block of memory, terminated by the null character '\\0' (ASCII value 0).",
      },
      {
        question: "Why does the swapping loop stop at len/2 or start >= end?",
        answer: "If the loop continues past the middle of the string, it will swap the characters back to their original positions, resulting in no change.",
      },
    ],
  },
  {
    subjectCode: "CS101",
    experimentNumber: 3,
    title: "Palindrome Number",
    problemStatement: "Write a program to check whether a given integer is a palindrome (reads the same backward as forward).",
    theory: "An integer is a palindrome if it remains the same when its digits are reversed. For example, 121, 343, and 12321 are palindromes, whereas 123 is not. The check is performed by extracting digits and building the reversed integer.",
    algorithm: "1. Read an integer 'n'.\n2. Store 'n' in a temporary variable 'original'.\n3. Initialize 'reversed = 0'.\n4. Loop while n > 0:\n   a. Get the last digit: remainder = n % 10.\n   b. Build reversed: reversed = (reversed * 10) + remainder.\n   c. Remove last digit: n = n / 10.\n5. Compare 'original' with 'reversed'.\n6. If they are equal, it's a palindrome; otherwise, it's not.",
    difficulty: "Easy",
    concepts: ["Loops", "Modulo Operator", "Conditionals"],
    hints: [
      "Keep a backup of the original number since the division operations will reduce 'n' to 0.",
      "Multiply your running reverse total by 10 and add the remainder (n % 10) in each step.",
      "Check if reversed == original at the end using an 'if' statement.",
    ],
    starterCode: `#include<stdio.h>
int main() {
    int n = 121;
    int original = n;
    int reversed = 0;
    
    // Write your code to reverse the digits of n
    
    if (original == reversed) {
        printf("121 is a Palindrome Number\\n");
    } else {
        printf("Not a Palindrome\\n");
    }
    return 0;
}`,
    sampleInput: "121",
    sampleOutput: "121 is a Palindrome Number",
    vivaQuestions: [
      {
        question: "How does the modulo operator % help in reversing a number?",
        answer: "Taking 'number % 10' extracts the last digit of the number (e.g., 121 % 10 = 1).",
      },
      {
        question: "What happens if we input a negative number for palindrome check?",
        answer: "Typically, negative numbers are not considered palindromes because the negative sign remains at the front (e.g., -121 reversed is 121-, which is not the same).",
      },
    ],
  },

  // Python Programming Experiments
  {
    subjectCode: "CS102",
    experimentNumber: 1,
    title: "Hello World",
    problemStatement: "Write a Python script to print 'Hello, World!' to the console.",
    theory: "In Python, we use the built-in print() function to write output. Python has simple syntax and doesn't require importing standard libraries or wrapping code in functions/classes for basic scripts, although main guards are recommended.",
    algorithm: "1. Define a main function.\n2. Inside main, invoke the print() function with 'Hello World'.\n3. Call the main function using the standard name guard.",
    difficulty: "Easy",
    concepts: ["Python Syntax", "Output stream", "Functions"],
    hints: [
      "Use the built-in print() function: print('Hello World').",
      "Indent your code inside the main() function using spaces or a tab.",
      "Call main() inside the 'if __name__ == \"__main__\":' block.",
    ],
    starterCode: `def main():
    # Write code here
    pass

if __name__ == "__main__":
    main()`,
    sampleInput: "No Input",
    sampleOutput: "Hello World",
    vivaQuestions: [
      {
        question: "What is the purpose of the 'if __name__ == \"__main__\":' check?",
        answer: "It ensures that the code block runs only when the script is executed directly, and not when it is imported as a module in another script.",
      },
      {
        question: "How does print() handle newlines by default?",
        answer: "The print() function appends a newline character automatically unless the 'end' parameter is customized (e.g., print('text', end=' ')).",
      },
    ],
  },
  {
    subjectCode: "CS102",
    experimentNumber: 2,
    title: "Prime Number",
    problemStatement: "Write a Python program to check if a given number is prime.",
    theory: "A prime number is a natural number greater than 1 that has no positive divisors other than 1 and itself. A number 'n' can be checked for primality by verifying if it is divisible by any integer from 2 up to the square root of 'n'.",
    algorithm: "1. If n <= 1, return False.\n2. Loop 'i' from 2 to the square root of n (inclusive):\n   a. If n % i == 0, return False (it is divisible).\n3. If loop finishes without finding divisors, return True.\n4. Output 'Prime' or 'Not Prime' based on the return value.",
    difficulty: "Easy",
    concepts: ["Mathematics", "Conditionals", "Loops", "Optimization"],
    hints: [
      "For primality testing, check numbers from 2 up to the square root of the number (int(n**0.5) + 1).",
      "Use the modulo operator % to check if the remainder is 0.",
      "Remember that numbers less than or equal to 1 are not prime.",
    ],
    starterCode: `def is_prime(n):
    # Write prime checking logic here
    return True

def main():
    num = 7
    if is_prime(num):
        print(f"{num} is a Prime Number")
    else:
        print(f"{num} is not prime")

if __name__ == "__main__":
    main()`,
    sampleInput: "7",
    sampleOutput: "7 is a Prime Number",
    vivaQuestions: [
      {
        question: "Why do we only need to check factors up to the square root of 'n'?",
        answer: "If a number 'n' has a factor greater than its square root, it must also have a corresponding factor smaller than its square root. Hence, checking up to the square root is sufficient.",
      },
      {
        question: "What is the only even prime number?",
        answer: "2 is the only even prime number. All other even numbers are divisible by 2.",
      },
    ],
  },
  {
    subjectCode: "CS102",
    experimentNumber: 3,
    title: "Fibonacci Series",
    problemStatement: "Generate the Fibonacci series up to N terms in Python.",
    theory: "The Fibonacci sequence is a series of numbers where each number is the sum of the two preceding ones, starting from 0 and 1. Mathematically: F(n) = F(n-1) + F(n-2).",
    algorithm: "1. Read N (number of terms).\n2. If N <= 0, print an empty list.\n3. If N == 1, print [0].\n4. Initialize a list with [0, 1].\n5. Run a loop from 2 to N - 1:\n   a. Calculate next term as sum of last two elements.\n   b. Append next term to list.\n6. Print the list or series.",
    difficulty: "Medium",
    concepts: ["Sequences", "Loops", "Lists", "Dynamic State"],
    hints: [
      "You can initialize two variables: a = 0, b = 1, and swap them: a, b = b, a + b.",
      "Use a list to collect the terms as you compute them, starting with [0, 1].",
      "Make sure you handle edge cases where the number of terms is 1 or 2.",
    ],
    starterCode: `def fibonacci(n):
    # Generate list of fibonacci terms and print them
    pass

def main():
    fibonacci(5)

if __name__ == "__main__":
    main()`,
    sampleInput: "5",
    sampleOutput: "0, 1, 1, 2, 3",
    vivaQuestions: [
      {
        question: "What is the time complexity of generating Fibonacci series iteratively?",
        answer: "The time complexity is O(N) since we calculate each term exactly once in a single loop.",
      },
      {
        question: "Why is a recursive implementation without memoization inefficient?",
        answer: "It leads to exponential time complexity O(2^N) because it performs redundant recalculations for the same subproblems.",
      },
    ],
  },
];

export async function seedDB() {
  try {
    // Clear existing data
    await Subject.deleteMany({});
    await Experiment.deleteMany({});
    console.log("Cleared existing subjects and experiments.");

    // Seed Subjects
    const createdSubjects = await Subject.insertMany(subjectsData);
    console.log(`Seeded ${createdSubjects.length} subjects.`);

    // Map subjects by code for quick lookup
    const subjectMap = {};
    createdSubjects.forEach((sub) => {
      subjectMap[sub.code] = sub._id;
    });

    // Prepare experiments with subjectId
    const experimentsToSeed = experimentsData.map((exp) => {
      const { subjectCode, ...rest } = exp;
      const subjectId = subjectMap[subjectCode];
      if (!subjectId) {
        throw new Error(`Subject with code ${subjectCode} not found during seeding.`);
      }
      return {
        ...rest,
        subjectId,
      };
    });

    // Seed Experiments
    const createdExperiments = await Experiment.insertMany(experimentsToSeed);
    console.log(`Seeded ${createdExperiments.length} experiments.`);
    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Database seeding failed:", error);
  }
}
