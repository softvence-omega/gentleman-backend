import { Controller, Get} from '@nestjs/common';
import { MetadataService } from '../service/metadata.service';

@Controller('metadata')
export class MetadataController {
    constructor(private metadataService: MetadataService){}
    @Get('metrics')
    async getDashboardMetrics() {
    return this.metadataService.getDashboardMetrics();
    }
}