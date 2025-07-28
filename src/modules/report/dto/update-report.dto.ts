import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ReportStatus, RefundStatus } from '../entity/report.entity';

export class UpdateReportDto {
  @IsOptional()
  @IsString()
  note?: string;

  @IsOptional()
  @IsEnum(ReportStatus)
  status?: ReportStatus;

  @IsOptional()
  @IsEnum(RefundStatus)
  refundStatus?: RefundStatus;
}
