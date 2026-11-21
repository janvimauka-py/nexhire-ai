import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronLeft, BookOpen, Code2, MessageSquare, CheckCircle, ChevronDown } from 'lucide-react'
import AppLayout from '../../components/layout/AppLayout'

const CONTENT: Record<string, any> = {
  python: {
    label: 'Python Programming', icon: '🐍',
    topics: [
      {
        id: 'basics', title: 'Python Basics', desc: 'Variables, data types, operators',
        questions: [
          { q: 'What is the difference between a list and a tuple in Python?', a: 'Lists are mutable (can be changed after creation), use square brackets, and are slower. Tuples are immutable (cannot be changed), use parentheses, and are faster. Use tuples for data that should not change, like coordinates or database records.' },
          { q: 'What are Python\'s built-in data types?', a: 'Python has: int, float, complex, str, list, tuple, set, frozenset, dict, bool, bytes, bytearray, NoneType.' },
          { q: 'What is the difference between == and is in Python?', a: '== checks value equality (whether two values are the same). is checks identity (whether two variables point to the same object in memory). Example: a = [1,2,3]; b = [1,2,3]; a == b is True but a is b is False.' },
        ],
        mcqs: [
          { q: 'What is the output of print(type([]))?', options: ["<class 'list'>", "<class 'array'>", "list", "Array"], answer: 0 },
          { q: 'Which is immutable in Python?', options: ['List', 'Set', 'Tuple', 'Dictionary'], answer: 2 },
        ],
        code: `# Python Basics Example
name = "NEXHIRE"
score = 95
is_ready = True

# f-string formatting
print(f"Welcome to {name}! Your score is {score}%")

# List vs Tuple
my_list = [1, 2, 3]  # Mutable
my_tuple = (1, 2, 3)  # Immutable

my_list.append(4)  # Works fine
# my_tuple.append(4)  # Would raise TypeError

print(my_list)   # [1, 2, 3, 4]
print(my_tuple)  # (1, 2, 3)
`,
      },
      {
        id: 'functions', title: 'Functions & Recursion', desc: 'def, lambda, decorators, recursion',
        questions: [
          { q: 'What is a lambda function in Python?', a: 'A lambda function is an anonymous (unnamed) function defined with the lambda keyword. Syntax: lambda arguments: expression. Example: square = lambda x: x**2. They are useful for short functions used once or as arguments to higher-order functions like map, filter, sorted.' },
          { q: 'What is recursion? Give an example.', a: 'Recursion is when a function calls itself to solve a smaller version of the same problem. It needs a base case to stop. Example – factorial: def factorial(n): return 1 if n <= 1 else n * factorial(n-1). Important: every recursive function must have a base case to prevent infinite recursion.' },
        ],
        mcqs: [
          { q: 'What is the output of (lambda x: x*2)(5)?', options: ['10', '5', '25', 'Error'], answer: 0 },
        ],
        code: `# Functions and Recursion

# Regular function
def greet(name, greeting="Hello"):
    return f"{greeting}, {name}!"

# Lambda function
square = lambda x: x ** 2
double = lambda x: x * 2

# Recursion - Fibonacci
def fibonacci(n):
    if n <= 1:  # Base case
        return n
    return fibonacci(n-1) + fibonacci(n-2)  # Recursive case

print(greet("Anway"))  # Hello, Anway!
print(square(5))  # 25
print([fibonacci(i) for i in range(8)])  # [0, 1, 1, 2, 3, 5, 8, 13]
`,
      },
      {
        id: 'oop', title: 'Object-Oriented Python', desc: 'Classes, inheritance, polymorphism',
        questions: [
          { q: 'What are the four pillars of OOP?', a: '1. Encapsulation: Bundling data and methods together, hiding internal state. 2. Abstraction: Showing only essential features, hiding complexity. 3. Inheritance: A class can inherit properties from another class. 4. Polymorphism: Same interface, different implementations.' },
        ],
        mcqs: [
          { q: 'Which keyword is used to inherit in Python?', options: ['inherits', 'extends', 'super', '( )'], answer: 3 },
        ],
        code: `# OOP in Python

class Animal:
    def __init__(self, name):
        self.name = name  # Encapsulation
    
    def speak(self):  # To be overridden (Polymorphism)
        raise NotImplementedError

class Dog(Animal):  # Inheritance
    def speak(self):
        return f"{self.name} says Woof!"

class Cat(Animal):
    def speak(self):
        return f"{self.name} says Meow!"

animals = [Dog("Buddy"), Cat("Whiskers")]
for animal in animals:
    print(animal.speak())  # Polymorphism in action
`,
      },
    ],
  },
  cpp: {
    label: 'C++ Programming', icon: '🔷',
    topics: [
      {
        id: 'oop', title: 'OOP in C++', desc: 'Classes, objects, constructors',
        questions: [
          { q: 'What is the difference between a class and a struct in C++?', a: 'In C++, the key difference is default access: class members are private by default, struct members are public by default. Structs are typically used for simple data containers, while classes are used for objects with behaviour. Both can have constructors, methods, and inheritance.' },
          { q: 'What is a constructor? What are its types?', a: 'A constructor is a special member function called automatically when an object is created. Types: 1. Default constructor (no arguments), 2. Parameterized constructor (with arguments), 3. Copy constructor (copies an existing object). Example: Student s1; (default), Student s2("Anway", 95); (parameterized).' },
        ],
        mcqs: [
          { q: 'By default, members of a C++ class are:', options: ['public', 'protected', 'private', 'static'], answer: 2 },
        ],
        code: `#include <iostream>
#include <string>
using namespace std;

class Student {
private:
    string name;
    int score;

public:
    // Constructor
    Student(string n, int s) : name(n), score(s) {}
    
    // Getter (Encapsulation)
    string getName() { return name; }
    int getScore() { return score; }
    
    // Method
    void display() {
        cout << "Student: " << name << ", Score: " << score << endl;
    }
};

int main() {
    Student s1("Anway", 95);
    Student s2("Arvi", 98);
    s1.display();
    s2.display();
    return 0;
}
`,
      },
      {
        id: 'stl', title: 'STL – Standard Template Library', desc: 'Vectors, maps, sets, algorithms',
        questions: [
          { q: 'What is STL and what are its components?', a: 'STL (Standard Template Library) is a collection of template classes and functions in C++. Components: 1. Containers: vector, list, map, set, queue, stack, etc. 2. Algorithms: sort, find, binary_search, reverse, etc. 3. Iterators: pointers to traverse containers. 4. Function Objects (Functors): Objects that act like functions.' },
        ],
        mcqs: [
          { q: 'Which STL container provides O(1) access by index?', options: ['list', 'vector', 'map', 'set'], answer: 1 },
        ],
        code: `#include <iostream>
#include <vector>
#include <map>
#include <algorithm>
using namespace std;

int main() {
    // Vector
    vector<int> nums = {5, 2, 8, 1, 9, 3};
    sort(nums.begin(), nums.end());  // O(n log n)
    
    cout << "Sorted: ";
    for (int x : nums) cout << x << " ";
    cout << endl;
    
    // Map (like Python dict)
    map<string, int> scores;
    scores["Anway"] = 95;
    scores["Arvi"] = 98;
    
    for (auto& [name, score] : scores) {
        cout << name << ": " << score << endl;
    }
    
    return 0;
}
`,
      },
    ],
  },
  java: {
    label: 'Java Programming', icon: '☕',
    topics: [
      {
        id: 'basics', title: 'Java Basics & OOP', desc: 'Syntax, classes, inheritance',
        questions: [
          { q: 'What is the JVM, JRE, and JDK?', a: 'JVM (Java Virtual Machine): Executes Java bytecode, makes Java platform-independent. JRE (Java Runtime Environment): Contains JVM + libraries needed to run Java programs. JDK (Java Development Kit): Contains JRE + development tools (compiler javac, debugger, etc.). Hierarchy: JDK > JRE > JVM.' },
          { q: 'What is the difference between abstract class and interface?', a: 'Abstract class: Can have both abstract and concrete methods, can have constructors, instance variables. A class can extend only one abstract class. Interface: Before Java 8, only abstract methods. After Java 8, can have default and static methods. No constructors, only constants. A class can implement multiple interfaces.' },
        ],
        mcqs: [
          { q: 'Java is platform-independent because of:', options: ['Compiler', 'JVM', 'JDK', 'IDE'], answer: 1 },
          { q: 'Which access modifier is most restrictive?', options: ['public', 'protected', 'default', 'private'], answer: 3 },
        ],
        code: `// Java OOP Example
public class Animal {
    private String name;
    
    public Animal(String name) {
        this.name = name;
    }
    
    public String getName() { return name; }
    
    // Can be overridden (Polymorphism)
    public String sound() {
        return "...";
    }
    
    @Override
    public String toString() {
        return name + " says " + sound();
    }
}

class Dog extends Animal {
    public Dog(String name) { super(name); }
    
    @Override
    public String sound() { return "Woof!"; }
}

// Usage
Dog d = new Dog("Buddy");
System.out.println(d);  // Buddy says Woof!
`,
      },
    ],
  },
  c: {
    label: 'C Programming', icon: '⚡',
    topics: [
      {
        id: 'basics', title: 'C Basics', desc: 'Variables, data types, loops',
        questions: [
          { q: 'What is the difference between printf and scanf?', a: 'printf is used for output – it prints formatted data to the screen. scanf is used for input – it reads formatted data from keyboard. Format specifiers: %d (int), %f (float), %c (char), %s (string). Example: printf("Score: %d", score); scanf("%d", &age);' },
          { q: 'What are pointers? Why are they important?', a: 'A pointer is a variable that stores the memory address of another variable. Declared as: int *p; p = &x; Pointers allow dynamic memory allocation, efficient array traversal, and passing large data by reference. The * operator dereferences a pointer (gets the value at the address).' },
        ],
        mcqs: [
          { q: 'Which operator is used to get the address of a variable?', options: ['*', '&', '#', '@'], answer: 1 },
          { q: 'What is the size of int in C on a 64-bit system?', options: ['2 bytes', '4 bytes', '8 bytes', 'Depends'], answer: 1 },
        ],
        code: `#include <stdio.h>
#include <stdlib.h>

// Pointers example
void swap(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

int main() {
    int x = 10, y = 20;
    printf("Before: x=%d, y=%d\\n", x, y);
    swap(&x, &y);
    printf("After: x=%d, y=%d\\n", x, y);
    
    // Dynamic memory allocation
    int *arr = (int*)malloc(5 * sizeof(int));
    for (int i = 0; i < 5; i++) arr[i] = i * 10;
    for (int i = 0; i < 5; i++) printf("%d ", arr[i]);
    free(arr);  // Always free!
    
    return 0;
}
`,
      },
    ],
  },
  javascript: {
    label: 'JavaScript', icon: '🟨',
    topics: [
      {
        id: 'basics', title: 'JS Fundamentals', desc: 'Variables, functions, closures, async',
        questions: [
          { q: 'What is the difference between var, let, and const?', a: 'var: Function-scoped, can be re-declared and re-assigned, hoisted with undefined. let: Block-scoped, can be re-assigned, not re-declared, hoisted but not initialised (TDZ). const: Block-scoped, cannot be re-assigned or re-declared. For objects/arrays, the contents can still be mutated.' },
          { q: 'What is a closure?', a: 'A closure is a function that has access to its own scope, the outer function\'s scope, and the global scope, even after the outer function has returned. Example: function counter() { let count = 0; return () => ++count; } The inner function "closes over" the count variable.' },
          { q: 'What is the event loop in JavaScript?', a: 'JavaScript is single-threaded. The event loop allows JS to perform non-blocking operations by using the call stack, Web APIs, callback queue, and microtask queue. The loop continuously checks if the call stack is empty and then moves callbacks from the queue to the stack.' },
        ],
        mcqs: [
          { q: 'Which keyword prevents reassignment of a variable?', options: ['var', 'let', 'const', 'static'], answer: 2 },
          { q: 'What does typeof null return?', options: ['null', 'undefined', 'object', 'string'], answer: 2 },
        ],
        code: `// JavaScript: Closures and Async

// Closure example
function counter() {
  let count = 0;
  return {
    increment: () => ++count,
    decrement: () => --count,
    get: () => count
  };
}

const c = counter();
c.increment(); c.increment(); c.increment();
console.log(c.get()); // 3

// Async/Await
async function fetchData(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// Arrow functions
const double = x => x * 2;
const nums = [1, 2, 3, 4, 5];
console.log(nums.map(double));  // [2, 4, 6, 8, 10]
console.log(nums.filter(x => x % 2 === 0));  // [2, 4]
`,
      },
    ],
  },
  html: {
    label: 'HTML & CSS', icon: '🌐',
    topics: [
      {
        id: 'basics', title: 'HTML Fundamentals', desc: 'Elements, attributes, forms, semantic HTML',
        questions: [
          { q: 'What is semantic HTML? Give examples.', a: 'Semantic HTML uses elements that describe their meaning to both the browser and developers. Examples: <header>, <nav>, <main>, <article>, <section>, <aside>, <footer>, <figure>, <figcaption>. Benefits: Better accessibility, improved SEO, cleaner code, screen reader support.' },
          { q: 'What is the difference between id and class attributes?', a: 'id: Unique identifier – should be used only once per page. Used for JavaScript targeting: document.getElementById(). CSS: #id. class: Can be used multiple times on multiple elements. Used for styling groups of elements. CSS: .class. id has higher CSS specificity than class.' },
        ],
        mcqs: [
          { q: 'Which tag is used for the most important heading?', options: ['<h6>', '<h1>', '<head>', '<header>'], answer: 1 },
          { q: 'Which attribute makes a form input required?', options: ['required', 'mandatory', 'must', 'validate'], answer: 0 },
        ],
        code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Semantic HTML Example</title>
</head>
<body>
  <header>
    <nav>
      <ul>
        <li><a href="#about">About</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </nav>
  </header>
  
  <main>
    <article>
      <h1>NEXHIRE AI</h1>
      <p>Your AI-powered interview preparation platform.</p>
    </article>
    
    <section id="contact">
      <form action="/submit" method="POST">
        <label for="email">Email:</label>
        <input type="email" id="email" name="email" required>
        <button type="submit">Submit</button>
      </form>
    </section>
  </main>
  
  <footer>
    <p>&copy; 2024 NEXHIRE AI</p>
  </footer>
</body>
</html>
`,
      },
    ],
  },
  sql: {
    label: 'SQL & Databases', icon: '🗃️',
    topics: [
      {
        id: 'basics', title: 'SQL Fundamentals', desc: 'SELECT, JOIN, GROUP BY, indexes',
        questions: [
          { q: 'What is the difference between INNER JOIN and OUTER JOIN?', a: 'INNER JOIN: Returns only matching rows from both tables. If no match, the row is excluded. LEFT OUTER JOIN: Returns all rows from the left table + matching rows from right (NULLs for no match on right). RIGHT OUTER JOIN: Opposite of LEFT JOIN. FULL OUTER JOIN: Returns all rows from both tables (NULLs where no match).' },
          { q: 'What is an index in SQL? When should you use it?', a: 'An index is a data structure that improves the speed of data retrieval. Like a book index, it allows the database to find data without scanning every row. Use indexes on: columns used in WHERE clauses, JOIN conditions, ORDER BY. Avoid on: columns with low cardinality (e.g., boolean), frequently updated columns.' },
        ],
        mcqs: [
          { q: 'Which SQL clause filters groups?', options: ['WHERE', 'HAVING', 'GROUP BY', 'ORDER BY'], answer: 1 },
          { q: 'What does DISTINCT do in SQL?', options: ['Sorts results', 'Removes duplicates', 'Filters rows', 'Joins tables'], answer: 1 },
        ],
        code: `-- SQL Examples

-- Basic SELECT with filtering
SELECT name, salary, department
FROM employees
WHERE salary > 50000
ORDER BY salary DESC;

-- INNER JOIN
SELECT e.name, d.department_name
FROM employees e
INNER JOIN departments d ON e.dept_id = d.id;

-- GROUP BY with HAVING
SELECT department, COUNT(*) as headcount, AVG(salary) as avg_salary
FROM employees
GROUP BY department
HAVING COUNT(*) > 5
ORDER BY avg_salary DESC;

-- Subquery
SELECT name, salary
FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees);

-- Window Functions
SELECT name, salary,
  RANK() OVER (PARTITION BY department ORDER BY salary DESC) as rank
FROM employees;
`,
      },
    ],
  },
}

export default function LearnTopicPage() {
  const { topic } = useParams()
  const content = CONTENT[topic || 'python'] || CONTENT.python
  const [selectedTopic, setSelectedTopic] = useState(0)
  const [openQ, setOpenQ] = useState<number | null>(null)
  const [openMcq, setOpenMcq] = useState<number | null>(null)
  const [mcqAnswers, setMcqAnswers] = useState<Record<number, number>>({})
  const [activeTab, setActiveTab] = useState<'questions' | 'mcq' | 'code'>('questions')

  const currentTopic = content.topics[selectedTopic]

  return (
    <AppLayout>
      <div className="flex h-[calc(100vh-65px)] overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 shrink-0 overflow-y-auto p-4 space-y-2 border-r border-white/10"
          style={{ background: 'rgba(10,15,44,0.5)' }}>
          <Link to="/learn" className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 text-sm">
            <ChevronLeft size={16} /> Back to Learn
          </Link>
          <h2 className="text-white font-bold text-lg flex items-center gap-2 mb-4">
            <span>{content.icon}</span> {content.label}
          </h2>
          {content.topics.map((t: any, i: number) => (
            <button key={t.id} onClick={() => { setSelectedTopic(i); setOpenQ(null); setOpenMcq(null) }}
              className={`w-full text-left px-3 py-3 rounded-xl text-sm transition-all ${selectedTopic === i ? 'text-white active' : 'sidebar-item'}`}>
              <div className="font-medium">{t.title}</div>
              <div className="text-gray-500 text-xs">{t.desc}</div>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div>
            <h1 className="text-2xl font-black text-white mb-1">{currentTopic.title}</h1>
            <p className="text-gray-400">{currentTopic.desc}</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 border-b border-white/10 pb-2">
            {([
              { id: 'questions', label: 'Interview Questions', icon: MessageSquare },
              { id: 'mcq', label: 'MCQ Quiz', icon: CheckCircle },
              { id: 'code', label: 'Code Examples', icon: Code2 },
            ] as const).map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id ? 'gradient-primary text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                <tab.icon size={14} /> {tab.label}
              </button>
            ))}
          </div>

          {/* Interview Questions */}
          {activeTab === 'questions' && (
            <div className="space-y-3">
              {currentTopic.questions.map((qa: any, i: number) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <div className="card cursor-pointer" onClick={() => setOpenQ(openQ === i ? null : i)}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="badge badge-blue text-xs mr-2">Q{i + 1}</span>
                        <span className="text-white font-medium">{qa.q}</span>
                      </div>
                      {openQ === i ? <ChevronDown size={18} className="text-blue-400 shrink-0" /> : <ChevronLeft size={18} className="text-gray-500 shrink-0 rotate-180" />}
                    </div>
                    {openQ === i && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="mt-4 p-4 rounded-xl text-gray-300 text-sm leading-relaxed"
                        style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)' }}>
                        {qa.a}
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* MCQ */}
          {activeTab === 'mcq' && (
            <div className="space-y-6">
              {currentTopic.mcqs.map((mcq: any, i: number) => (
                <div key={i} className="card p-6">
                  <p className="text-white font-medium mb-4">Q{i + 1}. {mcq.q}</p>
                  <div className="space-y-2">
                    {mcq.options.map((opt: string, j: number) => {
                      const answered = mcqAnswers[i] !== undefined
                      const isCorrect = j === mcq.answer
                      const isSelected = mcqAnswers[i] === j
                      return (
                        <button key={j} disabled={answered}
                          onClick={() => setMcqAnswers(prev => ({ ...prev, [i]: j }))}
                          className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all ${!answered ? 'hover:bg-white/5' : ''}
                            ${answered && isCorrect ? 'bg-green-500/20 border-green-500/40 text-green-300' : ''}
                            ${answered && isSelected && !isCorrect ? 'bg-red-500/20 border-red-500/40 text-red-300' : ''}
                            ${!answered || (!isCorrect && !isSelected) ? 'text-gray-300' : ''}`}
                          style={answered ? {} : { border: '1px solid rgba(255,255,255,0.1)' }}>
                          <span className="font-semibold mr-2">{String.fromCharCode(65 + j)}.</span> {opt}
                          {answered && isCorrect && <CheckCircle size={14} className="inline ml-2 text-green-400" />}
                        </button>
                      )
                    })}
                  </div>
                  {mcqAnswers[i] !== undefined && (
                    <p className={`mt-3 text-sm ${mcqAnswers[i] === mcq.answer ? 'text-green-400' : 'text-red-400'}`}>
                      {mcqAnswers[i] === mcq.answer ? '✅ Correct!' : `❌ Incorrect. Correct answer: ${mcq.options[mcq.answer]}`}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Code Examples */}
          {activeTab === 'code' && (
            <div className="space-y-4">
              <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(59,130,246,0.2)' }}>
                <div className="flex items-center px-4 py-3"
                  style={{ background: '#1a1f35', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <div className="flex gap-1.5 mr-4">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <span className="text-gray-400 text-xs font-mono">{currentTopic.title.toLowerCase().replace(/ /g, '_')}.{topic === 'javascript' ? 'js' : topic === 'html' ? 'html' : topic === 'sql' ? 'sql' : topic === 'cpp' || topic === 'c' ? (topic === 'cpp' ? 'cpp' : 'c') : 'py'}</span>
                </div>
                <pre className="p-4 text-sm text-green-300 font-mono leading-relaxed overflow-x-auto"
                  style={{ background: '#0a1628' }}>
                  {currentTopic.code}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  )
}
