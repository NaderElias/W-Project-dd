# example.py
import sys
def add_numbers(a, b):
    return a + b
if len(sys.argv) < 3:
        print("Usage: python example.py arg1 arg2")
        sys.exit(1)

    # Retrieve arguments
arg1 = sys.argv[1]
arg2 = sys.argv[2]
print(add_numbers(5, 4))
add_numbers(5, 4)
print(arg1,arg2)

