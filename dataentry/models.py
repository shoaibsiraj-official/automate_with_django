from django.db import models

# Create your models here.
class Student(models.Model):
    roll = models.IntegerField(max_length=10)
    name = models.CharField(max_length=20)
    age = models.IntegerField()
    

    def __str__(self):
        return (f"Student={self.name}+{self.age}")
    

class Employee(models.Model):
    employee_id = models.IntegerField()
    employee_name=models.CharField()
    designation = models.CharField()
    salary= models.FloatField()
    retirement = models.FloatField()
    other_benefits=models.CharField()
    total_benefits = models.CharField()
    total_compensation = models.CharField()

    def __str__(self):
        return self.employee_name
    
