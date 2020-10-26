import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import {UserService} from "./user.service";
import {PaginationQueryDto} from "../common/dto/pagination-query.dto";
import {CreateUserDto} from "./dto/create-user.dto";
import {UpdateUserDto} from "./dto/update-user.dto";

@Controller('user')
export default class UserController {
	constructor(private readonly userService: UserService) {}

	@Get()
	findAll(@Query() paginationQuery: PaginationQueryDto) {
		return this.userService.findAll(paginationQuery);
	}

	@Get(':userHash')
	findOne(@Param('userHash') userHash: string) {
		return this.userService.findOne(userHash);
	}

	@Post()
	create(@Body() createUserDto: CreateUserDto) {
		return this.userService.create(createUserDto);
	}

	@Put(':userHash')
	update(@Param('userHash') userHash: string, @Body() updateUserDto: UpdateUserDto) {
		return this.userService.update(userHash, updateUserDto);
	}

	@Delete(':userHash')
	delete(@Param('userHash') userHash: string) {
		return this.userService.remove(userHash);
	}
}