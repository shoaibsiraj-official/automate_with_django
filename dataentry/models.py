from django.db import models

# Create your models here.
class Student(models.Model):
    roll = models.IntegerField(max_length=10)
    name = models.CharField(max_length=20)
    age = models.IntegerField()
    

    def __str__(self):
        return (f"Student={self.name}+{self.age}")
    


class Customer(models.Model):
    id=models.CharField(primary_key=True)
    name=models.CharField(null=True)
    city= models.CharField(null=True)
    segment=models.CharField(null=True)
    state = models.CharField(null=True)
    
    def __str__(self):
        return (f'id={self.id},Customer={self.name},City={self.city},Segment={self.segment},State={self.state}')

    

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
    
