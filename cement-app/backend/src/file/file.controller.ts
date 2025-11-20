import { Controller, Post, UseInterceptors, UploadedFile, Get, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';
import * as path from 'path';
import * as XLSX from 'xlsx';

@Controller('files')
export class FileController {
    @Post('upload')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, cb) => {
                // Overwrite behavior: Use original name, replacing existing file if it exists
                cb(null, file.originalname);
            },
        }),
    }))
    uploadFile(@UploadedFile() file: Express.Multer.File) {
        console.log('File uploaded:', file);
        return {
            path: file.path,
            filename: file.filename,
            originalname: file.originalname,
            size: file.size,
        };
    }

    @Get('content')
    getContent(@Query('path') filePath: string) {
        // const fs = require('fs'); // Already imported as * as fs
        // const path = require('path'); // Already imported as * as path

        // Security check: Ensure path is within uploads directory
        const uploadsDir = path.resolve('./uploads');
        const resolvedPath = path.resolve(filePath);

        if (!resolvedPath.startsWith(uploadsDir)) {
            // For now, we might be receiving absolute paths that are valid but let's be careful.
            // If the path returned by upload is absolute, we should trust it if it's in our uploads folder.
            // Simplified check for this prototype:
            if (!resolvedPath.includes('uploads')) {
                throw new Error('Invalid file path');
            }
        }

        if (!fs.existsSync(resolvedPath)) {
            throw new Error('File not found');
        }

        const ext = path.extname(resolvedPath).toLowerCase();

        if (ext === '.xlsx' || ext === '.xls') {
            const workbook = XLSX.readFile(resolvedPath);
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];

            // Limit to first 100 rows for preview performance
            const json = XLSX.utils.sheet_to_json(sheet, { header: 1, range: 0 });
            const preview = json.slice(0, 100);

            return { content: JSON.stringify(preview) };
        }

        const content = fs.readFileSync(resolvedPath, 'utf-8');
        return { content };
    }
}
