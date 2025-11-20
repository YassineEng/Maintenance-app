export declare class FileController {
    uploadFile(file: Express.Multer.File): {
        path: string;
        filename: string;
        originalname: string;
        size: number;
    };
    getContent(filePath: string): {
        content: string;
    };
}
