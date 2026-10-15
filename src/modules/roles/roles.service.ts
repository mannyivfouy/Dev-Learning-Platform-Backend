import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto.js';
import { UpdateRoleDto } from './dto/update-role.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity.js';
import { Repository } from 'typeorm';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  create(createRoleDto: CreateRoleDto) {
    const role = this.roleRepository.create(createRoleDto);

    return this.roleRepository.save(role);
  }

  findAll() {
    return this.roleRepository.find();
  }

  async findOne(id: string) {
    const role = await this.roleRepository.findOne({
      where: { id },
    });

    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    return role;
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    const role = await this.findOne(id);

    Object.assign(role, updateRoleDto);

    return this.roleRepository.save(role);
  }

  async remove(id: string) {
    const role = await this.findOne(id);

    await this.roleRepository.remove(role);

    return {
      message: 'Role deleted successfully',
    };
  }
}
