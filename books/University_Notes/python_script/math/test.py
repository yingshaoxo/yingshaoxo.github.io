from auto_everything import math
from sympy import *

c = math.Calculator()
r = c.differential("x/(1-x)", "x", use_latex = True)
print(r)
