import { flushPromises, mount } from '@vue/test-utils';
import { Dayjs } from 'dayjs';
import DateInput from './DateInput.vue';

interface VM {
  focused: boolean;
}

describe('DateInput.vue', () => {
  it('snapshot tests', () => {
    const wrapper1 = mount(DateInput, {
      props: {
        label: 'DateInput test',
        value: '2022.6.13',
      },
    });

    expect(wrapper1.html()).toMatchSnapshot();

    const wrapper2 = mount(DateInput, {
      props: {
        label: 'DateInput test',
        value: '',
      },
    });

    expect(wrapper2.html()).toMatchSnapshot();
  });

  it('test focused ref value', async () => {
    const wrapper = mount(DateInput, {
      props: {
        label: 'DateInput test',
        value: '',
      },
    });
    expect((wrapper.vm as unknown as VM).focused).toEqual(false);

    const inputElement = wrapper.find('input');
    await inputElement.trigger('focus');
    expect((wrapper.vm as unknown as VM).focused).toEqual(true);

    await inputElement.trigger('blur');
    expect((wrapper.vm as unknown as VM).focused).toEqual(false);
  });

  it('emit focus, blur events', async () => {
    const wrapper = mount(DateInput, {
      props: {
        label: 'DateInput test',
        value: '',
      },
    });
    expect(wrapper.emitted()).not.toHaveProperty('focus');
    expect(wrapper.emitted()).not.toHaveProperty('blur');

    const inputElement = wrapper.find('input');
    await inputElement.trigger('focus');
    expect(wrapper.emitted()).toHaveProperty('focus');
    expect(wrapper.emitted()).not.toHaveProperty('blur');

    await inputElement.trigger('blur');
    expect(wrapper.emitted()).toHaveProperty('focus');
    expect(wrapper.emitted()).toHaveProperty('blur');
  });

  it('blur when keydown enter event triggered', async () => {
    const wrapper = mount(DateInput, {
      props: {
        label: 'DateInput test',
        value: '',
      },
    });

    const inputElement = wrapper.find('input');
    const inputRefBlurMock = vi.spyOn(inputElement.element, 'blur');

    await inputElement.trigger('focus');
    expect(wrapper.emitted()).toHaveProperty('focus');

    await inputElement.trigger('keydown.enter');
    await flushPromises();
    expect(inputRefBlurMock).toHaveBeenCalled();
  });
  it('emit undefined when invalid date input', async () => {
    const wrapper = mount(DateInput, {
      props: {
        label: 'DateInput test',
        value: '',
      },
    });

    const inputElement = wrapper.find('input');
    await inputElement.setValue('2022.234');
    await flushPromises();

    expect((wrapper.emitted().input?.[0] as never)[0]).toEqual('');
  });
  
  it('emit date string when valid date input', async () => {
    const wrapper = mount(DateInput, {
      props: {
        label: 'DateInput test',
        value: '',
      },
    });

    const inputElement = wrapper.find('input');
    await inputElement.setValue('2022.12.1');
    await flushPromises();

    expect(((wrapper.emitted().input?.[0] as never)[0] as Dayjs)).toEqual('2022-12-01');
  });

  it('emit date string when input is valid and date is in valid range', async () => {
    const disableDatesBefore = new Date(2022, 5, 3);
    const disableDatesAfter = new Date(2022, 5, 12);
    const wrapper = mount(DateInput, {
      props: {
        label: 'DateInput test',
        value: '',
        disableDatesAfter,
        disableDatesBefore,
      },
    });

    const inputElement = wrapper.find('input');
    await inputElement.setValue('2022.6.6');
    await flushPromises();

    expect(((wrapper.emitted().input?.[0] as never)[0] as Dayjs)).toEqual('2022-06-06');
  });
  it('emit undefined when input is valid and date is in invalid range 1', async () => {
    const disableDatesBefore = new Date(2022, 5, 3);
    const disableDatesAfter = new Date(2022, 5, 12);
    const wrapper = mount(DateInput, {
      props: {
        label: 'DateInput test',
        value: '',
        disableDatesAfter,
        disableDatesBefore,
      },
    });

    const inputElement = wrapper.find('input');
    await inputElement.setValue('2022.6.1');
    await flushPromises();

    expect((wrapper.emitted().input?.[0] as never)[0]).toEqual('');
  });
  it('emit undefined when input is valid and date is in invalid range 2', async () => {
    const disableDatesBefore = new Date(2022, 5, 3);
    const disableDatesAfter = new Date(2022, 5, 12);
    const wrapper = mount(DateInput, {
      props: {
        label: 'DateInput test',
        value: '',
        disableDatesAfter,
        disableDatesBefore,
      },
    });

    const inputElement = wrapper.find('input');
    await inputElement.setValue('2022.7.1');
    await flushPromises();

    expect((wrapper.emitted().input?.[0] as never)[0]).toEqual('');
  });
  it('유효한 value 값이 있는 경우 clear 버튼이 노출되지 않는다.', () => {
    const wrapper = mount(DateInput, {
      props: {
        label: 'DateInput test',
        value: '',
      },
    });

    expect(wrapper.find('button').element.classList.contains('hidden')).toEqual(true);
  });
  it('유효한 value 값이 있는 경우 clear 버튼이 노출된다.', () => {
    const wrapper = mount(DateInput, {
      props: {
        label: 'DateInput test',
        value: '2022.6.1',
      },
    });

    expect(wrapper.find('button').exists()).toBeTruthy();
  });
  it('유효한 value 값이 있는 상태에서 clear 버튼 클릭 시 undefined 값을 input 이벤트로 emit 한다.', async () => {
    const wrapper = mount(DateInput, {
      props: {
        label: 'DateInput test',
        value: '2022.6.1',
      },
    });

    const clearButton = wrapper.find('button');
    await clearButton.trigger('click');

    expect((wrapper.emitted().input?.[0] as never)[0]).toEqual('');
  });
});
