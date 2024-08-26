import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { NotFoundException } from '@nestjs/common';
import { Employee } from './schemas/employee.schema';
import { Types } from 'mongoose';

describe('EmployeeController', () => {
  let controller: EmployeeController;
  let service: EmployeeService;

  const mockEmployeeService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeeController],
      providers: [
        {
          provide: EmployeeService,
          useValue: mockEmployeeService,
        },
      ],
    }).compile();

    controller = module.get<EmployeeController>(EmployeeController);
    service = module.get<EmployeeService>(EmployeeService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of employees', async () => {
      const result: Employee[] = [
        {
          _id: new Types.ObjectId(),
          name: 'John Doe',
          email: 'john@example.com',
          position: 'Developer',
          department: 'Engineering',
        } as Employee,
      ];
      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return an employee by ID', async () => {
      const id = new Types.ObjectId();
      const result: Employee = {
        _id: id,
        name: 'John Doe',
        email: 'john@example.com',
        position: 'Developer',
        department: 'Engineering',
      } as Employee;

      jest.spyOn(service, 'findOne').mockResolvedValue(result);

      expect(await controller.findOne(id.toHexString())).toBe(result);
    });

    it('should throw a NotFoundException if employee is not found', async () => {
      const id = new Types.ObjectId();
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());

      await expect(controller.findOne(id.toHexString())).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should create a new employee', async () => {
      const createEmployeeDto: CreateEmployeeDto = {
        name: 'John Doe',
        email: 'john@example.com',
        position: 'Developer',
        department: 'Engineering',
        startDate: new Date(),
        role: 'employee',
      };
      const result: Employee = {
        _id: new Types.ObjectId(),
        ...createEmployeeDto,
      } as Employee;

      jest.spyOn(service, 'create').mockResolvedValue(result);

      expect(await controller.create(createEmployeeDto)).toBe(result);
    });
  });

  describe('update', () => {
    it('should update an employee and return the updated employee', async () => {
      const id = new Types.ObjectId();
      const updateEmployeeDto: UpdateEmployeeDto = { name: 'Updated Name' };
      const result: Employee = {
        _id: id,
        name: 'Updated Name',
        email: 'john@example.com',
        position: 'Developer',
        department: 'Engineering',
      } as Employee;

      jest.spyOn(service, 'update').mockResolvedValue(result);

      expect(await controller.update(id.toHexString(), updateEmployeeDto)).toBe(
        result,
      );
    });
  });

  describe('remove', () => {
    it('should remove an employee by ID', async () => {
      const id = new Types.ObjectId();
      jest.spyOn(service, 'remove').mockResolvedValue();

      await controller.remove(id.toHexString());
      expect(service.remove).toHaveBeenCalledWith(id.toHexString());
    });
  });
});
