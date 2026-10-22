import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { LessonProgressService } from './lesson_progress.service.js';
import { CreateLessonProgressDto } from './dto/create-lesson_progress.dto.js';
import { UpdateLessonProgressDto } from './dto/update-lesson_progress.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard.js';

@Controller('lesson-progress')
export class LessonProgressController {
  constructor(private readonly lessonProgressService: LessonProgressService) {}

  @Post()
  create(@Body() createLessonProgressDto: CreateLessonProgressDto) {
    return this.lessonProgressService.create(createLessonProgressDto);
  }

  @Get()
  findAll() {
    return this.lessonProgressService.findAll();
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  findMyProgress(@Request() request: any) {
    return this.lessonProgressService.findMyProgress(request.user.sub);
  }

  @Patch(':lessonId/complete')
  @UseGuards(JwtAuthGuard)
  completeLesson(@Param('lessonId') lessonId: string, @Request() request: any) {
    return this.lessonProgressService.completeLesson(
      request.user.sub,
      lessonId,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lessonProgressService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateLessonProgressDto: UpdateLessonProgressDto,
  ) {
    return this.lessonProgressService.update(id, updateLessonProgressDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lessonProgressService.remove(id);
  }
}
