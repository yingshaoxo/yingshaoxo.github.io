# coding: utf-8

state = ['busy', 'idle']


import datetime

days = []
for i in range(1, 90):
    the_day = datetime.datetime.now() + datetime.timedelta(days=i)
    days.append(
            str(the_day.month) + '.' + str(the_day.day)
        )


work_table = [
    {
        'month': '1',
        'day': '28',
    },
    {
        'month': '2',
        'day': '15-20',
    },
#    {
#        'month': '2-3',
#        'day': '15-20',
#    }
]



working_days = []

for item in work_table:
    month = item['month']
    day = item['day']
    if '-' in month:
        month_start = int(month.split('-')[0])
        month_end = int(month.split('-')[1])
        number_of_month = month_end - month_start
        how_many_days_between_the_two_mouth = number_of_month * 30
        for i in range(1, how_many_days_between_the_two_mouth):
            the_day = datetime.datetime(datetime.datetime.now().year, month_start,datetime.datetime.now().day) + datetime.timedelta(days=i)
            the_day = str(the_day.month) + '.' + str(the_day.day)
            if the_day not in working_days:
                working_days.append(the_day)
    elif '-' not in month:
        if '-' not in day:
            the_day = str(month) + '.' + str(day)
            if the_day not in working_days:
                working_days.append(the_day)
        elif '-' in day:
            day_start = int(day.split('-')[0])
            day_end = int(day.split('-')[1])
            number_of_days = day_end - day_start
            for i in range(0, number_of_days + 1):
                the_day = datetime.datetime(datetime.datetime.now().year, int(month), day_start) + datetime.timedelta(days=i)
                the_day = str(the_day.month) + '.' + str(the_day.day)
                if the_day not in working_days:
                    working_days.append(the_day)


data = []
for day in days:
    if day in working_days:
        data.append({
            'day': day, 
            'state': state[0]
        })
    else:
        data.append({
            'day': day, 
            'state': state[1]
        })
