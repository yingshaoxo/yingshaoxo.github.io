from auto_everything import math
from sympy import *

c = math.Calculator()
r = c.differential("-x**2*(tan(x**2/y)**2 + 1)/y**2", "x", use_latex = True)
print(r)
