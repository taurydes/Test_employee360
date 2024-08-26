import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { NotFoundException } from '@nestjs/common';
import { User } from './schemas/user.schema';
import { Types } from 'mongoose';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  const mockUserService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result: User[] = [
        {
          _id: new Types.ObjectId(), // Genera un ObjectId al azar
          username: 'user1',
          email: 'user1@example.com',
          password: 'hashedPassword',
          role: 'user',
        },
      ];
      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a user by ID', async () => {
      const result: User = {
        _id: new Types.ObjectId(), // Genera un ObjectId al azar
        username: 'user1',
        email: 'user1@example.com',
        password: 'hashedPassword',
        role: 'user',
      };
      jest.spyOn(service, 'findOne').mockResolvedValue(result);

      expect(await controller.findOne(result._id.toHexString())).toBe(result);
    });

    it('should throw a NotFoundException if user is not found', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());

      await expect(controller.findOne(new Types.ObjectId().toHexString())).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a user and return the updated user', async () => {
      const result: User = {
        _id: new Types.ObjectId(), // Genera un ObjectId al azar
        username: 'updatedUser',
        email: 'updatedUser@example.com',
        password: 'hashedPassword',
        role: 'user',
      };
      const updateUserDto = { username: 'updatedUser' };
      jest.spyOn(service, 'update').mockResolvedValue(result);

      expect(await controller.update(result._id.toHexString(), updateUserDto)).toBe(result);
    });
  });

  describe('remove', () => {
    it('should remove a user by ID', async () => {
      const objectId = new Types.ObjectId(); // Genera un ObjectId al azar
      jest.spyOn(service, 'remove').mockResolvedValue();

      await controller.remove(objectId.toHexString());
      expect(service.remove).toHaveBeenCalledWith(objectId.toHexString());
    });
  });
});
