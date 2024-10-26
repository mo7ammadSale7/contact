import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contact } from './schemas/contact.schema';
import { CreateContactDto } from './dto/create-contact.dto';
import { WebsocketGateway } from '../websocket/websocket.gateway';

@Injectable()
export class ContactsService {
  constructor(
    @InjectModel(Contact.name) private contactModel: Model<Contact>,
    private websocketGateway: WebsocketGateway,
  ) {}

  async create(createContactDto: CreateContactDto): Promise<Contact> {
    const createdContact = new this.contactModel(createContactDto);
    const contact = await createdContact.save();
    this.websocketGateway.notifyContactsUpdated();
    return contact;
  }

  async findAll(page: number, limit: number, filters: any): Promise<{ contacts: Contact[]; total: number }> {
    const query: any = {};
    if (filters.name) {
      query.name = { $regex: filters.name, $options: 'i' };
    }
    if (filters.phone) {
      query.phone = { $regex: filters.phone, $options: 'i' };
    }

    const [contacts, total] = await Promise.all([
      this.contactModel
        .find(query)
        .skip(page * limit)
        .limit(limit)
        .exec(),
      this.contactModel.countDocuments(query),
    ]);

    return { contacts, total };
  }

  async update(id: string, updateContactDto: CreateContactDto): Promise<Contact> {
    const contact = await this.contactModel
      .findByIdAndUpdate(id, updateContactDto, { new: true })
      .exec();
    
    if (!contact) {
      throw new NotFoundException(`Contact #${id} not found`);
    }

    this.websocketGateway.notifyContactsUpdated();
    return contact;
  }

  async remove(id: string): Promise<void> {
    const contact = await this.contactModel.findByIdAndDelete(id).exec();
    if (!contact) {
      throw new NotFoundException(`Contact #${id} not found`);
    }
    this.websocketGateway.notifyContactsUpdated();
  }

  async lockContact(id: string, username: string): Promise<void> {
    const contact = await this.contactModel.findById(id).exec();
    if (!contact) {
      throw new NotFoundException(`Contact #${id} not found`);
    }

    contact.lockedBy = username;
    contact.lockedAt = new Date();
    await contact.save();
    this.websocketGateway.notifyContactLocked(id, username);
  }

  async unlockContact(id: string): Promise<void> {
    const contact = await this.contactModel.findById(id).exec();
    if (!contact) {
      throw new NotFoundException(`Contact #${id} not found`);
    }

    contact.lockedBy = null;
    contact.lockedAt = null;
    await contact.save();
    this.websocketGateway.notifyContactUnlocked(id);
  }
}