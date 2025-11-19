import { Controller, Post, Delete, Body, Param, HttpException, HttpStatus } from '@nestjs/common';
import { ScriptService } from './script.service';

@Controller('scripts')
export class ScriptController {
    constructor(private readonly scriptService: ScriptService) { }

    @Post(':id/env')
    async createEnv(@Param('id') id: string) {
        try {
            await this.scriptService.createEnv(id);
            return { message: `Environment created for node ${id}` };
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Delete(':id/env')
    async deleteEnv(@Param('id') id: string) {
        try {
            await this.scriptService.deleteEnv(id);
            return { message: `Environment deleted for node ${id}` };
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post(':id/packages')
    async installPackages(@Param('id') id: string, @Body('packages') packages: string[]) {
        try {
            await this.scriptService.installPackages(id, packages);
            return { message: `Packages installed for node ${id}` };
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post(':id/run')
    async runScript(@Param('id') id: string, @Body('code') code: string) {
        try {
            const result = await this.scriptService.runScript(id, code);
            return { output: result };
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
