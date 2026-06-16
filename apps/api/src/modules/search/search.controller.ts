import { Controller, Get, Query } from '@nestjs/common'
import { SearchService } from './search.service'
import { Public } from '../../common/decorators/public.decorator'

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
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
    })
  }

  @Get('suggestions')
  @Public()
  suggestions(@Query('q') query: string) {
    if (!query || query.length < 2) return []
    return this.searchService.getSuggestions(query)
  }
}
