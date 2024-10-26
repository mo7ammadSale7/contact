import { Controller, Get, Post, Body, Put, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { AuthGuard } from '../auth/auth.guard';
import { User } from '../auth/user.decorator';

@Controller('contacts')
@UseGuards(AuthGuard)
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post()
  create(@Body() createContactDto: CreateContactDto) {
    return this.contactsService.create(createContactDto);
  }

  @Get()
  findAll(
    @Query('page') page = 0,
    @Query('limit') limit = 5,
    @Query('name') name?: string,
    @Query('phone') phone?: string,
  ) {
    return this.contactsService.findAll(page, limit, { name, phone });
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateContactDto: CreateContactDto) {
    return this.contactsService.update(id, updateContactDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contactsService.remove(id);
  }

  @Post(':id/lock')
  lockContact(@Param('id') id: string, @User() username: string) {
    return this.contactsService.lockContact(id, username);
  }

  @Post(':id/unlock')
  unlockContact(@Param('id') id: string) {
    return this.contactsService.unlockContact(id);
  }
}