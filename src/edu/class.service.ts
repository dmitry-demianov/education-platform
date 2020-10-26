import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Model} from 'mongoose';
import {Class} from "./entities/class.entity";
import {CreateClassDto} from "./dto/create-class.dto";
import {UpdateClassDto} from "./dto/update-class.dto";
import {PaginationQueryDto} from "../common/dto/pagination-query.dto";
import {AddLessonDto} from "./dto/add-lesson.dto";
import {LessonService} from "./lesson.service";

@Injectable()
export class ClassService {
	constructor(
		@InjectModel(Class.name) private readonly classModel: Model<Class>,
		private readonly lessonService: LessonService,
	) {}

	create(createClassDto: CreateClassDto) {
		const classOne = new this.classModel(createClassDto);
		return classOne.save();
	}

	async update(classHash: string, updateClassDto: UpdateClassDto) {
		const classOne = await this.classModel
			.findOneAndUpdate({ _id: classHash }, { $set: updateClassDto }, { new: true })
			.exec();

		if (!classOne) {
			throw new NotFoundException(`Class #${classHash} not found`);
		}

		return classOne;
	}

	async findOne(classHash: string) {
		const classOne = await this.classModel.findOne({ _id: classHash }).exec();
		if (!classOne) {
			throw new NotFoundException(`Class #[${classHash}] not found`);
		}
		return classOne;
	}

	async remove(classHash: string) {
		const classOne = await this.findOne(classHash);
		return classOne.remove();
	}

	findAll(paginationQuery: PaginationQueryDto) {
		let { limit, page } = paginationQuery;
		let offset = (--page) * limit;

		return this.classModel
			.find()
			.skip(offset)
			.limit(limit)
			.exec();
	}

	async addLesson(classHash: string, addLessonDto: AddLessonDto) {
		await this.lessonService.findOne(addLessonDto.lessonHash);

		const classOne = await this.findOne(classHash);

		if (classOne.lessons.indexOf(addLessonDto.lessonHash) < 0) {
			classOne.lessons.push(addLessonDto.lessonHash);
			await classOne.save();
		}

		return classOne;
	}

	async removeLesson(classHash: string, lessonHash: string) {
		await this.lessonService.findOne(lessonHash);

		const classOne = await this.findOne(classHash);
		const lessonIndex = classOne.lessons.indexOf(lessonHash);

		if (lessonIndex >= 0) {
			classOne.lessons.splice(lessonIndex, 1);
			await classOne.save();
		}

		return classOne;
	}
}