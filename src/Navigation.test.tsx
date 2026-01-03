import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Navigation from './Navigation'

describe('Navigation', () => {
  it('should render navigation links for all years', () => {
    render(<Navigation textColor="#FFFFFF" minYear={2020} maxYear={2023} />)

    expect(screen.getByText('2023')).toBeInTheDocument()
    expect(screen.getByText('2022')).toBeInTheDocument()
    expect(screen.getByText('2021')).toBeInTheDocument()
    expect(screen.getByText('2020')).toBeInTheDocument()
  })

  it('should render years in descending order', () => {
    render(<Navigation textColor="#FFFFFF" minYear={2020} maxYear={2023} />)

    const links = screen.getAllByRole('link')
    expect(links[0]).toHaveTextContent('2023')
    expect(links[1]).toHaveTextContent('2022')
    expect(links[2]).toHaveTextContent('2021')
    expect(links[3]).toHaveTextContent('2020')
  })

  it('should create correct hash URLs for each year', () => {
    render(<Navigation textColor="#FFFFFF" minYear={2020} maxYear={2023} />)

    const link2023 = screen.getByText('2023').closest('a')
    const link2022 = screen.getByText('2022').closest('a')

    expect(link2023).toHaveAttribute('href', '#/2023')
    expect(link2022).toHaveAttribute('href', '#/2022')
  })

  it('should apply text color to links', () => {
    const testColor = '#FF0000'
    render(<Navigation textColor={testColor} minYear={2020} maxYear={2022} />)

    const links = screen.getAllByRole('link')
    links.forEach((link) => {
      expect(link).toHaveStyle({ color: testColor })
    })
  })

  it('should render spacers between years', () => {
    const { container } = render(
      <Navigation textColor="#FFFFFF" minYear={2020} maxYear={2023} />
    )

    const spacers = container.querySelectorAll('.spacer')
    // Should have spacers between years (not before first year)
    expect(spacers.length).toBeGreaterThan(0)
  })

  it('should render with single year range', () => {
    render(<Navigation textColor="#FFFFFF" minYear={2023} maxYear={2023} />)

    expect(screen.getByText('2023')).toBeInTheDocument()
    expect(screen.getAllByRole('link')).toHaveLength(1)
  })

  it('should handle large year range', () => {
    render(<Navigation textColor="#FFFFFF" minYear={2008} maxYear={2025} />)

    // Should have 18 years (2008-2025)
    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(18)
  })

  it('should render line breaks for multiple lines', () => {
    const { container } = render(
      <Navigation textColor="#FFFFFF" minYear={2008} maxYear={2025} />
    )

    const lineBreaks = container.querySelectorAll('br')
    // With 18 items and 8 per line, should have line breaks
    expect(lineBreaks.length).toBeGreaterThan(0)
  })

  it('should have pipe spacers within same line', () => {
    render(<Navigation textColor="#FFFFFF" minYear={2020} maxYear={2025} />)

    // 6 years = 5 spacers (all on same line since < 8)
    expect(screen.getAllByText('|')).toHaveLength(5)
  })

  it('should apply text color to spacers', () => {
    const testColor = '#00FF00'
    const { container } = render(
      <Navigation textColor={testColor} minYear={2020} maxYear={2023} />
    )

    const spacers = container.querySelectorAll('.spacer')
    spacers.forEach((spacer) => {
      expect(spacer).toHaveStyle({ color: testColor })
    })
  })

  it('should handle different text colors', () => {
    const { rerender } = render(
      <Navigation textColor="#FFFFFF" minYear={2020} maxYear={2022} />
    )

    let links = screen.getAllByRole('link')
    links.forEach((link) => {
      expect(link).toHaveStyle({ color: '#FFFFFF' })
    })

    rerender(<Navigation textColor="#000000" minYear={2020} maxYear={2022} />)

    links = screen.getAllByRole('link')
    links.forEach((link) => {
      expect(link).toHaveStyle({ color: '#000000' })
    })
  })

  it('should not render spacer before first item', () => {
    const { container } = render(
      <Navigation textColor="#FFFFFF" minYear={2022} maxYear={2023} />
    )

    const navigation = container.querySelector('.Navigation')
    const firstChild = navigation?.firstChild

    // First child should be a link, not a spacer
    expect(firstChild).toBeInstanceOf(HTMLAnchorElement)
  })

  it('should handle 8 items per line boundary', () => {
    render(<Navigation textColor="#FFFFFF" minYear={2016} maxYear={2023} />)

    // 8 items (2023-2016) should all be on one line
    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(8)

    // Should have 7 spacers (all pipe, no line breaks yet)
    expect(screen.getAllByText('|')).toHaveLength(7)
  })

  it('should add line break after 8th item', () => {
    const { container } = render(
      <Navigation textColor="#FFFFFF" minYear={2014} maxYear={2023} />
    )

    // 10 items should span 2 lines
    const lineBreaks = container.querySelectorAll('br')
    expect(lineBreaks.length).toBeGreaterThanOrEqual(1)
  })

  it('should render correct structure with className', () => {
    const { container } = render(
      <Navigation textColor="#FFFFFF" minYear={2020} maxYear={2023} />
    )

    const navElement = container.querySelector('.Navigation')
    expect(navElement).toBeInTheDocument()
  })
})
