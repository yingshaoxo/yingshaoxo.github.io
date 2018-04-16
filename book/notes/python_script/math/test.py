from auto_everything import math
from sympy import *

c = math.Calculator()
r = c.differential(, "x")
r = integrate("1/(x + (y ** 2))")
print(r)
