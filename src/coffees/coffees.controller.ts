import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Protocol } from 'src/common/decorators/protocal.decorator';
import { Public } from 'src/common/decorators/public.decorator';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { ParseIntPipe } from 'src/common/pipes/parse-int.pipe';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';

@Controller('coffees')
export class CoffeesController {
  constructor(private readonly coffeesService: CoffeesService) {}

  @Public()
  @Get()
  async findAll(
    @Protocol() protocal,
    @Query() paginationQuery: PaginationQueryDto,
  ) {
    // await new Promise((resolve) => setTimeout(resolve, 5000));
    console.log(protocal);
    return this.coffeesService.findAll(paginationQuery);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.coffeesService.findOne(+id);
  }

  @Post()
  create(@Body() dto: CreateCoffeeDto) {
    return this.coffeesService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() dto: UpdateCoffeeDto) {
    return this.coffeesService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.coffeesService.remove(id);
  }
}
