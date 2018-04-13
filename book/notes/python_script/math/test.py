from auto_everything import math
from sympy import *

c = math.Calculator()
r = c.differential("1/(x + (y ** 2))", "x")
print(r)
