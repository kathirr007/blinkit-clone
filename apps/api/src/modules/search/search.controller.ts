import { Controller, Get, Query } from '@nestjs/common'
import { Public } from '../../common/decorators/public.decorator'
import { SearchService } from './search.service'

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @Public()
  search(
    @Query('q') query: string,
    @Query('category') category?: string,
    @Query('brand') brand?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.searchService.search(query || '', {
      category,
      brand,
      minPrice: minPrice ? Number.parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? Number.parseFloat(maxPrice) : undefined,
      page: page ? Number.parseInt(page) : undefined,
      limit: limit ? Number.parseInt(limit) : undefined,
    })
  }

  @Get('suggestions')
  @Public()
  suggestions(@Query('q') query: string) {
    if (!query || query.length < 2) return []
    return this.searchService.getSuggestions(query)
  }
}
